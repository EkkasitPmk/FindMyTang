import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "express";
import helmet from "helmet";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

function validateProductionEnvironment() {
  if (process.env.NODE_ENV !== "production") return;

  const required = [
    "DATABASE_URL",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "COOKIE_SECRET",
    "ALLOWED_ORIGINS",
  ];
  const missing = required.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      "Missing required production environment variables: " +
        missing.join(", "),
    );
  }

  const insecureDefaults = [
    "your-super-secret",
    "your-refresh-secret",
    "super-secret-cookie-key-for-development",
  ];
  const hasInsecureSecret = [
    process.env.JWT_ACCESS_SECRET,
    process.env.JWT_REFRESH_SECRET,
    process.env.COOKIE_SECRET,
  ].some((secret) => insecureDefaults.includes(secret ?? ""));

  if (hasInsecureSecret) {
    throw new Error("Production secrets must not use development defaults");
  }

  if (process.env.COOKIE_SECURE !== "true") {
    throw new Error("Production cookies must use Secure=true");
  }

  const sameSite = process.env.COOKIE_SAME_SITE?.toLowerCase();
  if (sameSite && !["lax", "strict", "none"].includes(sameSite)) {
    throw new Error("COOKIE_SAME_SITE must be lax, strict, or none");
  }

  const origins = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim());
  if (origins.some((origin) => !origin.startsWith("https://"))) {
    throw new Error("Production allowed origins must use HTTPS");
  }
}

async function bootstrap() {
  validateProductionEnvironment();
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  // ponytail: Keep request bodies bounded; receipts use the multipart limit below.
  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ extended: true, limit: "10mb" }));

  app.use(cookieParser(process.env.COOKIE_SECRET));

  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
    : [];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      const isLocal =
        process.env.NODE_ENV !== "production" &&
        (/^http:\/\/localhost(:\d+)?$/.test(origin) ||
          /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin) ||
          /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
          /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
          /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(
            origin,
          ));
      const isAllowedDomain = allowedOriginsEnv.includes(origin);

      if (isLocal || isAllowedDomain) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  });

  app.setGlobalPrefix("api");

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle("FindMyTang API")
    .setDescription("FindMyTang Backend API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((err) => {
  console.error("Failed to start the application:", err);
  process.exit(1);
});
