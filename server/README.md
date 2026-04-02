# 🚗 Carshop Backend - Documentação Completa

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

Backend REST API para gerenciamento de automóveis. Construído com **Fastify**, **Drizzle ORM** e **PostgreSQL**, seguindo arquitetura em camadas com validação de tipos end-to-end.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Configuração & Setup](#configuração--setup)
6. [Banco de Dados](#banco-de-dados)
7. [Módulos](#módulos)
8. [API Documentation](#api-documentation)
9. [Padrões de Código](#padrões-de-código)
10. [Desenvolvimento](#desenvolvimento)
11. [Erros & Tratamento](#erros--tratamento)
12. [Scripts Disponíveis](#scripts-disponíveis)

---

## Visão Geral

Carshop é uma aplicação backend que gerencia o cadastro e listagem de automóveis com as seguintes características:

- ✅ **Type-Safe**: TypeScript em 100% do código (compile-time & runtime)
- ✅ **Validação Rigorosa**: Zod para validação de entrada com mensagens claras
- ✅ **ORM Moderno**: Drizzle com queries type-safe e migrations automáticas
- ✅ **Arquitetura Limpa**: Separação clara entre Controllers, Services e Repositories
- ✅ **REST API**: Fastify com CORS habilitado
- ✅ **Docker**: PostgreSQL containerizado com docker-compose
- ✅ **Logging**: JSON logging integrado via Pino

---

## Arquitetura

### Padrão de Camadas: Controller → Service → Repository

```
┌─────────────────────────────────────────────────────────┐
│                  HTTP Layer (Fastify)                    │
│              POST /cars with JSON body                   │
└──────────────────┬────────────────────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │  CONTROLLER         │
         │ • Parse request     │
         │ • Validar com Zod   │
         │ • Orquestrar        │
         │ • Retornar HTTP     │
         └──────────┬──────────┘
                    │ (dados validados)
                    ▼
         ┌─────────────────────┐
         │  SERVICE            │
         │ • Lógica de negócio │
         │ • Orquestração      │
         │ • Validações        │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  REPOSITORY         │
         │ • Queries Drizzle   │
         │ • Mapeamento tipos  │
         │ • SQL execution     │
         └──────────┬──────────┘
                    │
                    ▼
              PostgreSQL
              (cars table)
```

**Benefícios desta arquitetura:**

- **Testabilidade**: Cada camada pode ser testada independentemente
- **Manutenibilidade**: Responsabilidades bem definidas
- **Reutilização**: Services e Repositories podem ser usados por múltiplos Controllers
- **Escalabilidade**: Fácil adicionar novos endpoints seguindo o padrão

---

## Stack Tecnológico

| Camada                 | Tecnologia  | Versão   | Propósito                 |
| ---------------------- | ----------- | -------- | ------------------------- |
| **Runtime**            | Node.js     | 25.5.0+  | Execução JavaScript       |
| **Linguagem**          | TypeScript  | 6.0.2+   | Type-safe development     |
| **Web Framework**      | Fastify     | ^5.8.4   | HTTP server framework     |
| **ORM**                | Drizzle     | ^0.45.2  | Database access layer     |
| **Database Driver**    | pg          | ^8.20.0  | PostgreSQL native driver  |
| **Banco de Dados**     | PostgreSQL  | 18+      | Database                  |
| **Validação**          | Zod         | ^4.3.6   | Runtime schema validation |
| **Package Manager**    | pnpm        | 10.32.1+ | Dependency management     |
| **Runtime TypeScript** | TSX         | ^4.21.0  | Execute TS directly       |
| **Migration Tool**     | Drizzle Kit | ^0.31.10 | Schema migrations         |

---

## Estrutura do Projeto

```
server/
├── docker-compose.yaml              # PostgreSQL container
├── drizzle.config.ts                # Configuração ORM & migrations
├── package.json                     # Dependências & scripts
├── pnpm-lock.yaml                   # Lock file
├── tsconfig.json                    # TypeScript compiler config
│
└── src/
    ├── server.ts                    # Entry point - bootstrap
    ├── app.ts                       # Fastify setup & middleware
    │
    ├── config/
    │   └── env.ts                   # Validação environment (Zod)
    │
    ├── db/
    │   ├── client.ts                # Drizzle client & pool
    │   ├── schema/
    │   │   ├── index.ts             # Schema barrel export
    │   │   └── cars.ts              # Cars table definition
    │   └── migrations/
    │       ├── 0000_vengeful_surge.sql
    │       └── meta/
    │           ├── _journal.json    # Migration history
    │           └── 0000_snapshot.json
    │
    └── modules/
        └── cars/
            ├── cars.controller.ts   # HTTP handler
            ├── cars.service.ts      # Business logic
            ├── cars.repository.ts   # Database queries
            ├── cars.routes.ts       # Route registration
            └── cars.schema.ts       # Zod validation schemas
```

### Responsabilidades por Arquivo

| Arquivo                           | Responsabilidade                                        |
| --------------------------------- | ------------------------------------------------------- |
| `server.ts`                       | Bootstrap da aplicação, iniciar listener                |
| `app.ts`                          | Criar instância Fastify, registrar middleware e módulos |
| `config/env.ts`                   | Validar e tipar variáveis de ambiente                   |
| `db/client.ts`                    | Conexão PostgreSQL e instância Drizzle                  |
| `db/schema/cars.ts`               | Definir estrutura da tabela "cars"                      |
| `modules/cars/cars.routes.ts`     | Registrar rotas Fastify do módulo                       |
| `modules/cars/cars.controller.ts` | Lidar com requisições HTTP                              |
| `modules/cars/cars.service.ts`    | Lógica de negócio do módulo                             |
| `modules/cars/cars.repository.ts` | Executar queries SQL no banco                           |
| `modules/cars/cars.schema.ts`     | Definir validação de entrada (Zod)                      |

---

## Configuração & Setup

### 1. Pré-requisitos

- Node.js >= 25.5.0
- pnpm >= 10.32.1
- Docker & Docker Compose (para PostgreSQL)

### 2. Clonar e Instalar

```bash
cd server

# Instalar dependências
pnpm install

# Copiar arquivo de ambiente
cp .env.example .env
```

### 3. Arquivo `.env`

```env
# Aplicação
NODE_ENV=development
PORT=3333

# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=carshop
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carshop

# OpenAI (opcional)
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
OPENAI_MODEL=gpt-4o-mini

> Observação: jamais commit `.env` ou valores reais de credenciais ao repositório.
```

### 4. Iniciar PostgreSQL

```bash
# Inicia container PostgreSQL em background
docker compose up -d

# Verificar se está rodando
docker compose ps

# Ver logs do banco
docker compose logs -f db
```

### 5. Rodar Migrations

```bash
# Verificar status das migrations
pnpm drizzle-kit migrate

# Ou gerar & aplicar em uma única ação
pnpm drizzle-kit generate && pnpm drizzle-kit migrate
```

### 6. Iniciar o Servidor

```bash
# Modo desenvolvimento (hot reload com tsx)
pnpm dev

# Modo produção (compilado)
pnpm build
node dist/server.js
```

Servidor estará disponível em: **http://localhost:3333**

---

## Banco de Dados

### Schema: Tabela `cars`

```typescript
// src/db/schema/cars.ts
export const cars = pgTable("cars", {
  id: uuid("id").primaryKey().defaultRandom(),
  brand: varchar("brand", { length: 80 }).notNull(),
  model: varchar("model", { length: 120 }).notNull(),
  version: varchar("version", { length: 120 }),
  year: integer("year").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  fuel: varchar("fuel", { length: 30 }).notNull(),
  transmission: varchar("transmission", { length: 30 }),
  mileage: integer("mileage"),
  imageUrl: varchar("image_url", { length: 2048 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
```

### SQL Gerado

```sql
CREATE TABLE "cars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" varchar(80) NOT NULL,
	"model" varchar(120) NOT NULL,
	"version" varchar(120),
	"year" integer NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"fuel" varchar(30) NOT NULL,
	"transmission" varchar(30),
	"mileage" integer,
	"image_url" varchar(2048),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
```

### Conectar ao Banco (CLI)

```bash
# Via psql
psql postgresql://postgres:postgres@localhost:5432/carshop

# Listar tabelas
\dt

# Ver schema da tabela cars
\d cars

# Query de teste
SELECT * FROM cars LIMIT 5;
```

### Visualizar Dados com Drizzle Studio

```bash
# Abrir web UI em http://localhost:5555
pnpm drizzle-kit studio
```

---

## Módulos

### Módulo: Cars

Responsável por gerenciar cadastro e consulta de automóveis.

#### Estrutura

```
modules/cars/
├── cars.controller.ts    # HTTP handlers
├── cars.service.ts       # Business logic
├── cars.repository.ts    # DB queries
├── cars.routes.ts        # Route registration
└── cars.schema.ts        # Validação (Zod)
```

#### Injeção de Dependência

```typescript
// cars.routes.ts - Construção bottom-up
const carsRepository = new CarsRepository(); // Sem deps
const carsService = new CarsService(carsRepository); // Dep: repo
const carsController = new CarsController(carsService); // Dep: service

export async function carsRoutes(app: FastifyInstance) {
  app.post("/cars", carsController.createCar);
}
```

**Vantagens:**

- Fácil mockar dependências para testes
- Possibilita trocar implementações (ex: mock repo)
- Responsabilidades claras por classe

---

## API Documentation

### Endpoints Disponíveis

```
GET  /health                        # Health check
POST /cars                          # Criar novo carro
POST /cars/search                   # Busca inteligente com IA (OpenAI)
```

### POST /cars - Criar Carro

**Requisição:**

```http
POST /cars HTTP/1.1
Host: localhost:3333
Content-Type: application/json

{
  "brand": "Toyota",
  "model": "Corolla",
  "version": "XLi",
  "year": 2024,
  "price": 25000,
  "fuel": "Gasoline",
  "transmission": "Automatic",
  "mileage": 0,
  "imageUrl": "https://example.com/corolla.jpg"
}
```

**Campos Obrigatórios:**
| Campo | Tipo | Restrições |
|-------|------|-----------|
| `brand` | string | Min 1 char |
| `model` | string | Min 1 char |
| `version` | string | Min 1 char |
| `year` | number | Int, 1886-2026 |
| `price` | number | Positivo |
| `fuel` | enum | "Gasoline"\|"Diesel"\|"Electric"\|"Hybrid" |
| `transmission` | enum | "Manual"\|"Automatic" |
| `mileage` | number | Int, >= 0 |
| `imageUrl` | string | _(opcional)_ Valid URL, max 2048 chars |

**Resposta de Sucesso (201 Created):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "brand": "Toyota",
  "model": "Corolla",
  "version": "XLi",
  "year": 2024,
  "price": "25000.00",
  "fuel": "Gasoline",
  "transmission": "Automatic",
  "mileage": 0,
  "imageUrl": "https://example.com/corolla.jpg",
  "createdAt": "2026-04-02T10:15:30.123Z",
  "updatedAt": "2026-04-02T10:15:30.123Z"
}
```

**Resposta de Validação Inválida (400 Bad Request):**

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "string",
      "path": ["year"],
      "message": "Expected number, received string"
    },
    {
      "code": "invalid_enum_value",
      "received": "Gas",
      "options": ["Gasoline", "Diesel", "Electric", "Hybrid"],
      "path": ["fuel"],
      "message": "Invalid enum value. Expected 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid'"
    }
  ]
}
```

### Exemplos com curl

```bash
# Criar carro com sucesso
curl -X POST http://localhost:3333/cars \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Toyota",
    "model": "Corolla",
    "version": "XLi",
    "year": 2024,
    "price": 25000,
    "fuel": "Gasoline",
    "transmission": "Automatic",
    "mileage": 0
  }'

# Falha: campo obrigatório faltando
curl -X POST http://localhost:3333/cars \
  -H "Content-Type: application/json" \
  -d '{"brand": "Toyota", "model": "Corolla"}'

# Falha: valor inválido (ano no futuro)
curl -X POST http://localhost:3333/cars \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Toyota",
    "model": "Corolla",
    "version": "XLi",
    "year": 2100,
    "price": 25000,
    "fuel": "Gasoline",
    "transmission": "Automatic",
    "mileage": 0
  }'
```

### POST /cars/search - Busca avançada com NLP OpenAI

**Requisição:**

```http
POST /cars/search HTTP/1.1
Host: localhost:3333
Content-Type: application/json

{ "search": "procuro um Corolla 2018 2019 com menos de 80000 km" }
```

**Como funciona:**

- O `AISearchAgentService` chama OpenAI no modo `chat.completions.create` com ferramenta `buscar_carros`.
- O modelo precisa retornar `tool_calls` com argumentos:
  - `marca` -> `brand`
  - `nome` -> `model`
  - `versao` -> `version`
  - `ano` -> `year`
  - `ano_min` / `ano_max` -> `yearMin` / `yearMax`
  - `km_min` / `km_max` -> `mileageMin` / `mileageMax`
- O serviço então busca no DB a partir de `CarsRepository.searchFilterCars` com _query builder_.

**Exemplo de corpo aceito (funcional):**

```json
{
  "search": "encontre Honda Civic 2016 a 2020 com até 90000 km"
}
```

**Resposta de Sucesso (200 OK):**

```json
{
  "items": [
    /* array de carros */
  ],
  "reply": "Encontrei X veículos com os critérios fornecidos no nosso catálogo."
}
```

---

## Padrões de Código

### 1. Validação com Zod (Schema-First)

```typescript
// src/modules/cars/cars.schema.ts
export const createCarSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  year: z.number().int().min(1886).max(new Date().getFullYear()),
  fuel: z.enum(["Gasoline", "Diesel", "Electric", "Hybrid"]),
  // ...
});

// Tipo inferido diretamente do schema
export type CreateCarInput = z.infer<typeof createCarSchema>;

// Uso no controller
const validated: CreateCarInput = createCarSchema.parse(request.body);
// TypeScript garante tipagem: validated.year é number, fuel é string específico
```

**Benefícios:**

- Single source of truth (schema = validação + tipos)
- Type-safety em compile-time
- Validação em runtime
- Mensagens de erro customizadas

### 2. Controllers com Validação

```typescript
// src/modules/cars/cars.controller.ts
import { ZodError } from "zod";
import { createCarSchema } from "./cars.schema.js";

export async function createCar(request: FastifyRequest, reply: FastifyReply) {
  try {
    const validatedData = createCarSchema.parse(request.body);
    const createdCar = await carsService.createCar(validatedData);
    return reply.status(201).send(createdCar);
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "Validation failed",
        details: error.errors,
      });
    }
    throw error; // Propagar erros não-validação
  }
}
```

**Padrão:**

1. Validar com Zod
2. Se inválido → 400 com detalhes
3. Se válido → chamar service
4. Retornar resultado com status apropriado

### 3. Queries Drizzle Type-Safe

```typescript
// src/modules/cars/cars.repository.ts
import { db } from "../../db/client.js";
import { cars } from "../../db/schema/cars.js";

export async function createCar(data: CreateCarInput) {
  const [createdCar] = await db
    .insert(cars)
    .values({
      brand: data.brand, // ✓ TypeScript valida tipos
      model: data.model,
      year: data.year, // ✓ Compile error se tipo errado
      price: data.price.toFixed(2), // ✓ Converter para string para numeric(12,2)
      // ...
    })
    .returning(); // ✓ TypeScript conhece o shape retornado

  if (!createdCar) {
    throw new Error("Failed to create car");
  }

  return createdCar; // ✓ Tipo inferido automaticamente
}
```

**Type-Safety:**

- Coluna inexistente → erro compile-time
- Tipo incorreto → erro compile-time
- Resultado `.returning()` → tipo conhecido pelo TypeScript

### 4. Injeção de Dependência

```typescript
// cars.routes.ts
const carsRepository = new CarsRepository();
const carsService = new CarsService(carsRepository);
const carsController = new CarsController(carsService);

export async function carsRoutes(app: FastifyInstance) {
  app.post("/cars", carsController.createCar);
}
```

**Testabilidade:**

```typescript
// cars.service.test.ts
import { CarsService } from "./cars.service";

const mockRepository = {
  createCar: async (data) => ({
    id: "test-id",
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};

const service = new CarsService(mockRepository as any);
const result = await service.createCar({ brand: "Test", ... });
// ✓ Funciona sem banco de dados real
```

---

## Desenvolvimento

### Fluxo de uma Nova Feature

Exemplo: Adicionar endpoint `GET /cars`

#### 1. Atualizar Repository

```typescript
// cars.repository.ts
export async function listCars() {
  return await db.select().from(cars);
}

export async function getCarById(id: string) {
  const [car] = await db.select().from(cars).where(eq(cars.id, id));
  if (!car) throw new Error("Car not found");
  return car;
}
```

#### 2. Adicionar ao Service

```typescript
// cars.service.ts
export async function listCars() {
  return await carsRepository.listCars();
}

export async function getCarById(id: string) {
  return await carsRepository.getCarById(id);
}
```

#### 3. Criar Controller Handler

```typescript
// cars.controller.ts
export async function getCars(request: FastifyRequest, reply: FastifyReply) {
  const cars = await carsService.listCars();
  return reply.status(200).send(cars);
}

export async function getCarById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  // Validar UUID (opcional - adicionar schema)
  if (!isValidUUID(id)) {
    return reply.status(400).send({ error: "Invalid car ID" });
  }

  const car = await carsService.getCarById(id);
  return reply.status(200).send(car);
}
```

#### 4. Registrar Rotas

```typescript
// cars.routes.ts
export async function carsRoutes(app: FastifyInstance) {
  app.post("/cars", carsController.createCar);
  app.get("/cars", carsController.getCars);
  app.get("/cars/:id", carsController.getCarById);
}
```

### Debug & Logging

```bash
# Logs JSON estruturados (Pino)
# Exemplo de saída:
{"level":20,"time":"2026-04-02T10:15:30.123Z","pid":1234,"hostname":"localhost","method":"POST","url":"/cars","status":201,"responseTime":45}

# Ativar debug mode (se implementado)
DEBUG=* pnpm dev
```

---

## Erros & Tratamento

### Estratégia de Erros

| Camada         | Tipo      | Tratamento               |
| -------------- | --------- | ------------------------ |
| **Controller** | Validação | Zod parse → 400          |
| **Controller** | Lógica    | Try/catch → 4xx/5xx      |
| **Service**    | Negócio   | Throw erros customizados |
| **Repository** | DB        | Throw com contexto       |

### Padrão Recomendado

```typescript
// Erros customizados
export class DuplicateCarError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateCarError";
  }
}

// Repository
export async function createCar(data: CreateCarInput) {
  try {
    const [result] = await db.insert(cars).values(data).returning();
    return result;
  } catch (error) {
    if (error.code === "23505") {
      // UniqueViolation
      throw new DuplicateCarError("Car already registered");
    }
    throw error;
  }
}

// Controller - Mapear erros para HTTP
export async function createCar(req, reply) {
  try {
    const valid = createCarSchema.parse(req.body);
    const car = await carsService.createCar(valid);
    return reply.status(201).send(car);
  } catch (error) {
    if (error instanceof ZodError) {
      return reply
        .status(400)
        .send({ error: "Invalid data", details: error.errors });
    }
    if (error instanceof DuplicateCarError) {
      return reply.status(409).send({ error: error.message });
    }
    return reply.status(500).send({ error: "Internal server error" });
  }
}
```

---

## Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar servidor com hot reload
pnpm dev

# Compilar TypeScript
pnpm build

# Gerar migrations da schema
pnpm drizzle-kit generate

# Aplicar migrations ao banco
pnpm drizzle-kit migrate

# Ver status das migrations
pnpm drizzle-kit migrate:status

# Abrir Drizzle Studio (Web UI)
pnpm drizzle-kit studio
```

### Docker

```bash
# Iniciar PostgreSQL em background
docker compose up -d

# Parar e remover containers
docker compose down

# Ver logs do banco
docker compose logs db

# Acessar postgres via CLI
docker compose exec db psql -U postgres -d carshop
```

---

## Estrutura Resumida de Uma Requisição

```
1. Cliente → curl/Postman
   ↓
2. Fastify recebe POST /cars
   ↓
3. Router → cars.controller.createCar()
   ↓
4. Controller valida JSON com Zod
   ├─ Inválido? → Return 400 + error details
   └─ Válido? → Continuar
   ↓
5. Controller → cars.service.createCar()
   ↓
6. Service → cars.repository.createCar()
   ↓
7. Repository → Drizzle insert()
   ↓
8. Drizzle → PostgreSQL
   ├─ Query: INSERT INTO cars (...) VALUES (...) RETURNING *
   └─ Resultado: novo car com id gerado
   ↓
9. Repository return car object
   ↓
10. Service return car object
   ↓
11. Controller return reply.status(201).send(car)
   ↓
12. Cliente recebe JSON 201 + dados do carro criado
```

---

## Checklist de Setup Completo

- [ ] Node.js 25.5.0+ instalado
- [ ] pnpm 10.32.1+ instalado
- [ ] `pnpm install` executado
- [ ] `.env` configurado com DATABASE_URL
- [ ] `docker compose up -d` rodando PostgreSQL
- [ ] `pnpm drizzle-kit migrate` executado
- [ ] `pnpm dev` inicia servidor em :3333
- [ ] `curl http://localhost:3333/teste` retorna 200
- [ ] POST /cars com dados válidos retorna 201

---

## Próximos Passos

### Features Sugeridas

1. **GET /cars** - Listar todos os carros
2. **GET /cars/:id** - Buscar carro por ID
3. **PUT /cars/:id** - Atualizar carro
4. **DELETE /cars/:id** - Deletar carro
5. **Autenticação** - JWT ou sessions
6. **Paginação** - Limit/offset em listagens
7. **Filtros** - Por marca, ano, preço
8. **Testes** - Vitest ou Jest com cobertura
9. **Upload de Imagens** - Substituir URL por file upload
10. **Cache** - Redis para listagens frequentes

### Melhorias Técnicas

- [ ] Adicionar middleware de logging detalhado
- [ ] Implementar error handler global
- [ ] Setup de testes unitários
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Documentação OpenAPI/Swagger
- [ ] Rate limiting
- [ ] Health check endpoint

---

## Referências

- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Zod Documentation](https://zod.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## Desenvolvedor

Criado em **Abril de 2026** com foco em arquitetura robusta, type-safety e boas práticas de backend.

---

## Licença

Proprietary - Carshop 2026
