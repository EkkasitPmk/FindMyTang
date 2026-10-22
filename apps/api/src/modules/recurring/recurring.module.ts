import { Module } from "@nestjs/common";
import { RecurringController } from "./controllers/recurring.controller";
import { RecurringService } from "./services/recurring.service";
import { RecurringRepository } from "./repositories/recurring.repository";

@Module({
  controllers: [RecurringController],
  providers: [RecurringService, RecurringRepository],
  exports: [RecurringService, RecurringRepository],
})
export class RecurringModule {}
