import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma/prisma.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("health")
  async getHealth() {
    try {
      await this.prisma.$queryRawUnsafe("SELECT 1");
      return { status: "ok", database: "ok" };
    } catch {
      throw new ServiceUnavailableException({
        status: "unavailable",
        database: "unavailable",
      });
    }
  }
}
