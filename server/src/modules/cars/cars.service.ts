import type { CarsRepository } from "./cars.repository.js";
import type { CreateCarInput, SearchCarsRequestInput } from "./cars.schema.js";

export class CarsService {
  constructor(private readonly carsRepository: CarsRepository) {}

  async execute(input: CreateCarInput) {
    return await this.carsRepository.createCar(input);
  }

  async searchCars(input: SearchCarsRequestInput) {
    // TODO: Implement actual repository query when repository support is added
    throw new Error("Not implemented: CarsRepository.searchCars");
  }
}
