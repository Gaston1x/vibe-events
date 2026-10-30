import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { z } from "zod";
import { config } from "../config.js";
import { getPool, sql } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const SQL_UNIQUE_VIOLATION = 2627;

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
  acceptedTerms: z.literal(true),
  isAdult: z.literal(true),
  marketingOptIn: z.boolean().default(false),
  termsVersion: z.string().trim().min(1).max(20),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(120).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
});

const preferencesSchema = z.object({
  marketingOptIn: z.boolean(),
});

const deleteSchema = z.object({
  password: z.string().min(8).max(128),
});

function publicUser(record) {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
    marketingOptIn: Boolean(record.marketing_opt_in),
  };
}

// El token solo lleva el id y el rol; nombre y correo se piden a /me.
function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

async function audit(pool, userId, action) {
  await pool.request().input("userId", sql.UniqueIdentifier, userId).input("action", sql.NVarChar(60), action).query(`
    INSERT INTO dbo.UserAuditLog (user_id, action) VALUES (@userId, @action)
  `);
}

router.post("/register", async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(payload.password, 12);
    const pool = await getPool();

    const result = await pool
      .request()
      .input("name", sql.NVarChar(80), payload.name)
      .input("email", sql.NVarChar(120), payload.email)
      .input("passwordHash", sql.NVarChar(255), passwordHash)
      .input("termsVersion", sql.NVarChar(20), payload.termsVersion)
      .input("marketingOptIn", sql.Bit, payload.marketingOptIn)
      .query(`
        INSERT INTO dbo.Users (name, email, password_hash, terms_version, accepted_terms_at, is_adult_confirmed, marketing_opt_in)
        OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role, INSERTED.marketing_opt_in
        VALUES (@name, @email, @passwordHash, @termsVersion, SYSUTCDATETIME(), 1, @marketingOptIn)
      `);

    const user = publicUser(result.recordset[0]);
    await audit(pool, user.id, `register:terms:${payload.termsVersion}`);
    return res.status(201).json({ user, token: signToken(user) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Revisa tus datos y acepta los términos para crear la cuenta." });
    }
    if (error?.number === SQL_UNIQUE_VIOLATION) {
      return res.status(409).json({ message: "Este correo ya está registrado." });
    }
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const pool = await getPool();
    const result = await pool
      .request()
      .input("email", sql.NVarChar(120), payload.email)
      .query(`
        SELECT TOP 1 id, name, email, role, marketing_opt_in, password_hash
        FROM dbo.Users
        WHERE email = @email AND is_active = 1
      `);

    const record = result.recordset[0];
    if (!record) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos." });
    }

    const valid = await bcrypt.compare(payload.password, record.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos." });
    }

    const user = publicUser(record);

    await pool
      .request()
      .input("id", sql.UniqueIdentifier, user.id)
      .query("UPDATE dbo.Users SET last_login_at = SYSUTCDATETIME() WHERE id = @id");

    return res.json({ user, token: signToken(user) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Datos de inicio de sesión inválidos." });
    }
    return next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.UniqueIdentifier, req.user.sub)
      .query("SELECT TOP 1 id, name, email, role, marketing_opt_in FROM dbo.Users WHERE id = @id AND is_active = 1");

    if (!result.recordset[0]) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.json({ user: publicUser(result.recordset[0]) });
  } catch (error) {
    return next(error);
  }
});

router.patch("/me/preferences", requireAuth, async (req, res, next) => {
  try {
    const payload = preferencesSchema.parse(req.body);
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.UniqueIdentifier, req.user.sub)
      .input("marketingOptIn", sql.Bit, payload.marketingOptIn)
      .query(`
        UPDATE dbo.Users SET marketing_opt_in = @marketingOptIn, updated_at = SYSUTCDATETIME()
        OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role, INSERTED.marketing_opt_in
        WHERE id = @id AND is_active = 1
      `);

    if (!result.recordset[0]) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    await audit(pool, req.user.sub, payload.marketingOptIn ? "marketing:opt-in" : "marketing:unsubscribe");
    return res.json({ user: publicUser(result.recordset[0]) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Preferencia inválida." });
    }
    return next(error);
  }
});

router.delete("/me", requireAuth, async (req, res, next) => {
  try {
    const payload = deleteSchema.parse(req.body);
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.UniqueIdentifier, req.user.sub)
      .query("SELECT TOP 1 password_hash FROM dbo.Users WHERE id = @id");

    const record = result.recordset[0];
    if (!record || !(await bcrypt.compare(payload.password, record.password_hash))) {
      return res.status(401).json({ message: "La contraseña no es correcta." });
    }

    // El historial queda anónimo (user_id NULL) y se borra la fila del usuario.
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      await transaction.request().input("id", sql.UniqueIdentifier, req.user.sub).query(`
        UPDATE dbo.UserAuditLog SET user_id = NULL WHERE user_id = @id;
        DELETE FROM dbo.Users WHERE id = @id;
        INSERT INTO dbo.UserAuditLog (user_id, action) VALUES (NULL, N'account:deleted');
      `);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    return res.status(204).end();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Escribe tu contraseña para confirmar." });
    }
    return next(error);
  }
});

export default router;
