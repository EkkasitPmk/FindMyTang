import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma/prisma.service";

describe("AppController", () => {
  let appController: AppController;
  const prismaMock = {
    $queryRawUnsafe: jest.fn().mockResolvedValue([{ "?column?": 1 }]),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe("Hello World!");
    });

    it("reports a healthy database", async () => {
      await expect(appController.getHealth()).resolves.toEqual({
        status: "ok",
        database: "ok",
      });
    });

    it("reports database outages as unavailable", async () => {
      prismaMock.$queryRawUnsafe.mockRejectedValueOnce(
        new Error("database unavailable"),
      );

      await expect(appController.getHealth()).rejects.toBeInstanceOf(Error);
    });
  });
});
