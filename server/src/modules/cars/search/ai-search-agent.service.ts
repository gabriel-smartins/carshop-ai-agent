import "dotenv/config";
import { OpenAI } from "openai";
import type { CarsRepository } from "../cars.repository.js";
import { z } from "zod";
import type { SearchFilters } from "../cars.schema.js";

const TOOL_NAME = "buscar_carros";

const toolArgsSchema = z.object({
  marca: z.string().trim().min(1).optional(),
  nome: z.string().trim().min(1).optional(),
  versao: z.string().trim().min(1).optional(),
  ano: z.number().int().gte(1886).lte(new Date().getFullYear()).optional(),
  ano_min: z.number().int().gte(1886).lte(new Date().getFullYear()).optional(),
  ano_max: z.number().int().gte(1886).lte(new Date().getFullYear()).optional(),
  km_min: z.number().int().gte(0).optional(),
  km_max: z.number().int().gte(0).optional(),
});

const BUSCAR_CARROS_TOOL = {
  type: "function" as const,
  function: {
    name: TOOL_NAME,
    description:
      'Consulta o catálogo por critérios. Preencha tudo o que a pergunta deixar claro. `marca` = fabricante (BMW, Fiat). `nome` = modelo (Gol, T-Cross). `versao` = motor/trim (1.4, Comfortline). `ano` = ano-modelo exato (use só um: `ano` OU `ano_min`/`ano_max`, não misture). `ano_min`/`ano_max` = faixa ("de 2018 a 2020", "a partir de 2019"). `km_min`/`km_max` = quilometragem em km inteiros ("50 mil km" → km_max: 50000; "acima de 100 mil" → km_min: 100000). Ex.: {"marca":"BMW"}; {"nome":"Gol","versao":"1.4"}; {"ano":2020}; {"ano_min":2018,"ano_max":2020}; {"km_max":50000}. Use {} só para pedidos genéricos sem marca, modelo, versão, ano nem km (ex.: "mostre tudo").',
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        marca: {
          type: "string",
          description:
            "Fabricante do carro, quando citado, inclusive sozinho, (ex: 'tem bmw?' -> BMW )",
        },
        nome: {
          type: "string",
          description: "Modelo (ex: Gol, T-Cross, 320i)",
        },
        versao: {
          type: "string",
          description:
            "Versão do carro ou motor, quando citado (ex: 1.4, 1.0, Comfortline, TSI, etc.)",
        },
        ano: {
          type: "integer",
          description: "Ano exato do veículo (ex: 2020)",
        },
        ano_min: {
          type: "integer",
          description: "Ano mínimo da faixa (ex: 2010)",
        },
        ano_max: {
          type: "integer",
          description: "Ano máximo da faixa (ex: 2022)",
        },
        km_min: {
          type: "integer",
          description: "Quilometragem mínima (ex: 50000)",
        },
        km_max: {
          type: "integer",
          description: "Quilometragem máxima (ex: 100000)",
        },
      },
    },
  },
} satisfies OpenAI.ChatCompletionTool;

function naturalReply(itemCount: number): string {
  if (itemCount === 0) {
    return "Não encontrei nenhum veículo com os critérios fornecidos no nosso catálogo.";
  }

  if (itemCount === 1) {
    return "Encontrei 1 veículo com os critérios fornecidos no nosso catálogo.";
  }

  return `Encontrei ${itemCount} veículos com os critérios fornecidos no nosso catálogo.`;
}

function toolJsonToFilters(raw: string): SearchFilters {
  try {
    const parsed = toolArgsSchema.safeParse(JSON.parse(raw) as unknown);

    if (!parsed.success) {
      return {};
    }
    const { marca, nome, versao, ano, ano_min, ano_max, km_min, km_max } =
      parsed.data;

    return {
      ...(marca ? { brand: marca } : {}),
      ...(versao ? { version: versao } : {}),
      ...(nome ? { model: nome } : {}),
      ...(ano ? { year: ano } : {}),
      ...(ano_min ? { yearMin: ano_min } : {}),
      ...(ano_max ? { yearMax: ano_max } : {}),
      ...(km_min ? { mileageMin: km_min } : {}),
      ...(km_max ? { mileageMax: km_max } : {}),
    };
  } catch (error) {
    return {};
  }
}

export class AISearchAgentService {
  private readonly client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(private readonly carsRepository: CarsRepository) {}

  async run(userMessage: string) {
    console.log("Received user message:", userMessage);

    const completion = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL as string,
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "Assistente de catálogo de veículos (português). Chame buscar_carros exatamente uma vez. Preencha `marca` se citar fabricante; `nome` para modelo; `versao` para motor/trim; `ano` para um ano-modelo exato (não misture com ano_min/ano_max); `ano_min` e/ou `ano_max` para intervalos de ano; `km_min` e/ou `km_max` para quilometragem em km inteiros (ex.: 50 mil → 50000). Combine campos quando fizer sentido. Só use argumentos vazios {} se a mensagem for genérica (listar tudo) sem nenhum desses critérios.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      tools: [BUSCAR_CARROS_TOOL],
      tool_choice: "required",
    });

    const toolCalls = completion.choices[0]?.message.tool_calls ?? [];
    console.log("Tool calls from model:", toolCalls);

    const call = toolCalls.find(
      (c): c is Extract<(typeof toolCalls)[number], { type: "function" }> =>
        c.type === "function" && c.function.name === TOOL_NAME,
    );

    const filters = call
      ? toolJsonToFilters(call.function.arguments ?? "{}")
      : {};

    const { items } = await this.carsRepository.searchFilterCars({ filters });

    return {
      items,
      reply: naturalReply(items.length),
    };
  }
}
