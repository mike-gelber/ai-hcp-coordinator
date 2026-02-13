import { z } from "zod";

/**
 * Environment variable schema.
 * Validates all required env vars at startup.
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().startsWith("postgresql://"),

  // Redis
  REDIS_URL: z.string().url().startsWith("redis://"),

  // OpenAI (optional in dev/demo mode)
  OPENAI_API_KEY: z.string().optional(),

  // NPPES API
  NPPES_API_URL: z.string().url().default("https://npiregistry.cms.hhs.gov/api/"),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  DEMO_MODE: z
    .enum(["true", "false"])
    .default("false")
    .transform((val) => val === "true"),

  // Node
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables against the schema.
 * Call this at app startup to fail fast on misconfiguration.
 */
export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(result.error.format(), null, 2),
    );
    throw new Error("Invalid environment variables");
  }

  return result.data;
}

/**
 * Lazy-loaded validated env (singleton).
 */
let _env: Env | undefined;

export function getEnv(): Env {
  if (!_env) {
    _env = validateEnv();
  }
  return _env;
}
