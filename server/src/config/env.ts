import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().int().min(1).default(3333),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().min(1).default("gpt-4o-mini"),
});

const parseEnv = envSchema.safeParse(process.env);

if (!parseEnv.success) {
  throw new Error(
    "Variáveis de ambiente inválidas: " +
      JSON.stringify(parseEnv.error.format()),
  );
}

export const env = parseEnv.data;
