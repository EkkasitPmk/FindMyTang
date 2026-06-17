import { Module } from "@nestjs/common";
import { TransactionController } from "./controllers/transaction.controller";
import { TransactionService } from "./services/transaction.service";
import { TransactionRepository } from "./repositories/transaction.repository";
import { AssetModule } from "../asset/asset.module";
import { CategoryModule } from "../category/category.module";

@Module({
  imports: [AssetModule, CategoryModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
