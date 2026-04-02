import { version } from "node:os";
import { z } from "zod";

export const createCarSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  version: z.string().min(1, "Version is required"),
  year: z
    .number()
    .int()
    .min(1886, "Year must be greater than or equal to 1886")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  price: z.number().positive("Price must be a positive number"),
  fuel: z.enum(
    ["Gasoline", "Diesel", "Electric", "Hybrid"],
    "Fuel must be one of: Gasoline, Diesel, Electric, Hybrid",
  ),
  transmission: z.enum(
    ["Manual", "Automatic"],
    "Transmission must be either Manual or Automatic",
  ),
  mileage: z
    .number()
    .int()
    .nonnegative("Mileage must be a non-negative integer"),
  imageUrl: z
    .string()
    .trim()
    .url("Image URL must be a valid URL")
    .max(2048)
    .optional(),
});

export const searchRequestSchema = z.object({
  search: z.string().min(1, "Search query is required"),
});

export const filtersSchema = z.object({
  brand: z.string().trim().min(1).optional(),
  model: z.string().trim().min(1).optional(),
  version: z.string().trim().min(1).max(120).optional(),
  year: z.number().int().gte(1886).lte(new Date().getFullYear()).optional(),
  yearMin: z.number().int().gte(1886).lte(new Date().getFullYear()).optional(),
  yearMax: z.number().int().gte(1886).lte(new Date().getFullYear()).optional(),
  mileageMin: z.number().int().gte(0).optional(),
  mileageMax: z.number().int().gte(0).optional(),
});

export type SearchCarsRequestInput = z.infer<typeof searchRequestSchema>;
export type CreateCarInput = z.infer<typeof createCarSchema>;
export type SearchFilters = z.infer<typeof filtersSchema>;
