import type { CarsRepository } from "./cars.repository.js";
import type { CreateCarInput, SearchCarsRequestInput } from "./cars.schema.js";
import type { AISearchAgentService } from "./search/ai-search-agent.service.js";

export class CarsService {
  constructor(
    private readonly carsRepository: CarsRepository,
    private readonly searchAgent: AISearchAgentService,
  ) {}

  async execute(input: CreateCarInput) {
    return await this.carsRepository.createCar(input);
  }

  async searchCars(input: SearchCarsRequestInput) {
    const result = await this.searchAgent.run(input.search);

    return result;
  }
}
