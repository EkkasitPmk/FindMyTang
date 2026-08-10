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
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { CacheModule } from "@nestjs/cache-manager";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
      load: [jwtConfig, cookieConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    CacheModule.register({
      isGlobal: true,
      ttl: 300000, // 5 minutes
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
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
