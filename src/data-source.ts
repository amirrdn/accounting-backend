import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Parse DATABASE_URL if it exists
let dbConfig: DataSourceOptions = {
  type: "mysql"
};

if (process.env.DATABASE_URL) {
  // Production: Use DATABASE_URL
  dbConfig = {
    type: "mysql",
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Allow self-signed certificates
    }
  };
} else {
  // Development: Use individual config
  dbConfig = {
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  };
}

export const AppDataSource = new DataSource({
  ...dbConfig,
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"]
});
