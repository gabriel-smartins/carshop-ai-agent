import type { FastifyReply, FastifyRequest } from "fastify";
import { createCarSchema, searchRequestSchema } from "./cars.schema.js";
import type { CarsService } from "./cars.service.js";

export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  createCar = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createCarSchema.parse(request.body);
    const result = await this.carsService.execute(body);

    return reply.status(201).send(result);
  };

  searchCars = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = searchRequestSchema.parse(request.body);
    const result = await this.carsService.searchCars(body);

    return reply.status(200).send(result);
  };
}
