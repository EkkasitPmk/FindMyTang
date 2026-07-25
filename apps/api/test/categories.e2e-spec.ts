import { Test, TestingModule } from "@nestjs/testing";
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import cookieParser from "cookie-parser";

describe("Category (e2e)", () => {
  let app: INestApplication<App>;
  let userCookies: string[];

  const email = `test-cat-${Date.now()}@example.com`;
  const password = "password123";
  const displayName = "Cat Test";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(
      cookieParser(
        process.env.COOKIE_SECRET || "super-secret-cookie-key-for-development",
      ),
    );
    app.setGlobalPrefix("api");
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: "1",
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    // Register user
    await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .send({
        email,
        password,
        confirmPassword: password,
        displayName,
      })
      .expect(201);

    // Login user
    const loginRes = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({
        email,
        password,
      })
      .expect(201);

    userCookies = loginRes.headers["set-cookie"] as unknown as string[];
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /api/v1/categories", () => {
    it("should return 401 if unauthorized", () => {
      return request(app.getHttpServer())
        .post("/api/v1/categories")
        .send({
          name: "Food",
          type: "EXPENSE",
        })
        .expect(401);
    });

    it("should return 400 if validation fails (empty name)", () => {
      return request(app.getHttpServer())
        .post("/api/v1/categories")
        .set("Cookie", userCookies)
        .send({
          name: "",
          type: "EXPENSE",
        })
        .expect(400);
    });

    it("should return 400 if validation fails (invalid type)", () => {
      return request(app.getHttpServer())
        .post("/api/v1/categories")
        .set("Cookie", userCookies)
        .send({
          name: "Food",
          type: "INVALID_TYPE",
        })
        .expect(400);
    });

    it("should successfully create a category with valid parameters", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/v1/categories")
        .set("Cookie", userCookies)
        .send({
          name: "Dining Out",
          type: "EXPENSE",
          color: "#FF5733",
          icon: "food-icon",
        })
        .expect(201);

      expect(res.body).toBeDefined();
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe("Dining Out");
      expect(res.body.type).toBe("EXPENSE");
      expect(res.body.color).toBe("#FF5733");
      expect(res.body.icon).toBe("food-icon");
    });
  });

  describe("GET /api/v1/categories", () => {
    it("should return 401 if unauthorized", () => {
      return request(app.getHttpServer()).get("/api/v1/categories").expect(401);
    });

    it("should return list of user's categories", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/v1/categories")
        .set("Cookie", userCookies)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);

      const diningCategory = res.body.find((c: any) => c.name === "Dining Out");
      expect(diningCategory).toBeDefined();
      expect(diningCategory.type).toBe("EXPENSE");
      expect(diningCategory.color).toBe("#FF5733");
      expect(diningCategory.icon).toBe("food-icon");
    });
  });
});
