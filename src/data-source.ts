import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
console.log("Loading environment from:", envFile);
dotenv.config({ path: path.resolve(__dirname, "..", envFile) });

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: process.env.NODE_ENV === "production" 
    ? [path.join(__dirname, "entity/**/*.js")]
    : ["src/entity/**/*.ts"],
  migrations: process.env.NODE_ENV === "production"
    ? [path.join(__dirname, "migration/**/*.js")]
    : ["src/migration/**/*.ts"],
  subscribers: process.env.NODE_ENV === "production"
    ? [path.join(__dirname, "subscriber/**/*.js")]
    : ["src/subscriber/**/*.ts"],
});
