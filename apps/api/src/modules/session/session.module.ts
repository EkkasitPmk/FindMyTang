import { Module } from "@nestjs/common";
import { SessionController } from "./controllers/session.controller";
import { SessionService } from "./services/session.service";
import { SessionRepository } from "./repositories/session.repository";

@Module({
  controllers: [SessionController],
  providers: [SessionService, SessionRepository],
  exports: [SessionService, SessionRepository],
})
export class SessionModule {}
