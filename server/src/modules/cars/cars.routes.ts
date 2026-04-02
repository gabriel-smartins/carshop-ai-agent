import type { FastifyInstance } from "fastify";
import { CarsController } from "./cars.controller.js";
import { CarsService } from "./cars.service.js";
import { CarsRepository } from "./cars.repository.js";
import { AISearchAgentService } from "./search/ai-search-agent.service.js";

const carsRepository = new CarsRepository();
const searchAgent = new AISearchAgentService(carsRepository);
const carsService = new CarsService(carsRepository, searchAgent);
const carsController = new CarsController(carsService);

export async function carsRoutes(app: FastifyInstance) {
  app.post("/cars", carsController.createCar);
  app.post("/cars/search", carsController.searchCars);
}
