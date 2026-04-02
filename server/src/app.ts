import Fastify from "fastify";
import cors from "@fastify/cors";
import { carsRoutes } from "./modules/cars/cars.routes.js";
import { db } from "./db/client.js";
import { sql } from "drizzle-orm";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: true,
  });

  app.get("/health", async (request, reply) => {
    try {
      await db.execute(sql`SELECT 1`);

      return reply.status(200).send({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
          database: "connected",
        },
        memoryUsage: {
          rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        },
      });
    } catch (error) {
      request.log.error(error, "Health check failed: Database connection lost");

      return reply.status(503).send({
        status: "error",
        timestamp: new Date().toISOString(),
        services: {
          database: "disconnected",
        },
        message: "One or more essential services are down",
      });
    }
  });

  app.register(carsRoutes);

  return app;
}
