import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user/user.module";
import { AssetModule } from "./modules/asset/asset.module";
import { CategoryModule } from "./modules/category/category.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { SessionModule } from "./modules/session/session.module";
import jwtConfig from "./common/config/jwt.config";
import cookieConfig from "./common/config/cookie.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, cookieConfig],
    }),
    PrismaModule,
    UserModule,
    AssetModule,
    CategoryModule,
    AuthModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
