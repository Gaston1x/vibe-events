import sql from "mssql";
import { config } from "./config.js";

let poolPromise;

export function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config.sql);
  }
  return poolPromise;
}

export { sql };
