import { Module } from "@nestjs/common";
import { AssetController } from "./controllers/asset.controller";
import { AssetService } from "./services/asset.service";
import { AssetRepository } from "./repositories/asset.repository";

@Module({
  controllers: [AssetController],
  providers: [AssetService, AssetRepository],
  exports: [AssetService, AssetRepository],
})
export class AssetModule {}
