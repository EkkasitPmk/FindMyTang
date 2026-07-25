import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user/user.module";
import { AssetModule } from "./modules/asset/asset.module";
import { CategoryModule } from "./modules/category/category.module";
import { TransactionModule } from "./modules/transaction/transaction.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { SummaryModule } from "./modules/summary/summary.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import jwtConfig from "./common/config/jwt.config";
import cookieConfig from "./common/config/cookie.config";
import { StorageModule } from "./common/storage/storage.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, cookieConfig],
    }),
    PrismaModule,
    StorageModule,
    UserModule,
    AssetModule,
    CategoryModule,
    TransactionModule,
    AuthModule,
    SummaryModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
