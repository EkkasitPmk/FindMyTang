import { Module } from "@nestjs/common";
import { SummaryController } from "./controllers/summary.controller";
import { SummaryService } from "./services/summary.service";
import { SummaryRepository } from "./repositories/summary.repository";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [SummaryController],
  providers: [SummaryService, SummaryRepository],
  exports: [SummaryService],
})
export class SummaryModule {}
