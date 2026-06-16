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

describe("App & Auth (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser(process.env.COOKIE_SECRET || "super-secret-cookie-key-for-development"));
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
  });

  it("/api/v1 (GET)", () => {
    return request(app.getHttpServer())
      .get("/api/v1")
      .expect(200)
      .expect("Hello World!");
  });

  describe("Authentication Flow", () => {
    const email = `test-${Date.now()}@example.com`;
    const password = "password123";
    const displayName = "John Test";

    it("/api/v1/auth/me should return 401 Unauthorized if not logged in", () => {
      return request(app.getHttpServer())
        .get("/api/v1/auth/me")
        .expect(401);
    });

    it("should register, login, and fetch /api/v1/auth/me correctly", async () => {
      // 1. Register a new user
      await request(app.getHttpServer())
        .post("/api/v1/auth/register")
        .send({
          email,
          password,
          confirmPassword: password,
          displayName,
        })
        .expect(201);

      // 2. Login
      const loginRes = await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({
          email,
          password,
        })
        .expect(201);

      const cookies = loginRes.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies.some((cookie: string) => cookie.includes("access_token"))).toBe(true);

      // 3. Get profile using the cookie
      const meRes = await request(app.getHttpServer())
        .get("/api/v1/auth/me")
        .set("Cookie", cookies)
        .expect(200);

      expect(meRes.body).toBeDefined();
      expect(meRes.body.id).toBeDefined();
      expect(meRes.body.email).toBe(email);
      expect(meRes.body.displayName).toBe(displayName);
      expect(meRes.body.passwordHash).toBeUndefined();
      expect(meRes.body.password).toBeUndefined();
      expect(meRes.body.session).toBeUndefined();
      expect(meRes.body.role).toBeUndefined();
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
