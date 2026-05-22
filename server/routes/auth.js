import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { z } from "zod";
import { config } from "../config.js";
import { getPool, sql } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(120).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
});

function publicUser(record) {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
  };
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );
}

router.post("/register", async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(payload.password, 12);
    const pool = await getPool();

    const exists = await pool
      .request()
      .input("email", sql.NVarChar(120), payload.email)
      .query("SELECT TOP 1 id FROM dbo.Users WHERE email = @email");

    if (exists.recordset.length > 0) {
      return res.status(409).json({ message: "Este correo ya está registrado." });
    }

    const result = await pool
      .request()
      .input("name", sql.NVarChar(80), payload.name)
      .input("email", sql.NVarChar(120), payload.email)
      .input("passwordHash", sql.NVarChar(255), passwordHash)
      .query(`
        INSERT INTO dbo.Users (name, email, password_hash)
        OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role
        VALUES (@name, @email, @passwordHash)
      `);

    const user = publicUser(result.recordset[0]);
    return res.status(201).json({ user, token: signToken(user) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Datos de registro inválidos." });
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
        SELECT TOP 1 id, name, email, role, password_hash
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
      .query("SELECT TOP 1 id, name, email, role FROM dbo.Users WHERE id = @id AND is_active = 1");

    if (!result.recordset[0]) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.json({ user: publicUser(result.recordset[0]) });
  } catch (error) {
    return next(error);
  }
});

export default router;
