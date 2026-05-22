import dotenv from "dotenv";

dotenv.config();

const required = ["JWT_SECRET", "SQL_SERVER", "SQL_DATABASE", "SQL_USER", "SQL_PASSWORD"];

export function validateEnvironment() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

export const config = {
  port: Number(process.env.PORT || 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://127.0.0.1:5173",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "2h",
  sql: {
    server: process.env.SQL_SERVER,
    port: Number(process.env.SQL_PORT || 1433),
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    options: {
      encrypt: process.env.SQL_ENCRYPT === "true",
      trustServerCertificate: process.env.SQL_TRUST_SERVER_CERTIFICATE !== "false",
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },
};
