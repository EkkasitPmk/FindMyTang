import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as crypto from "node:crypto";

// ponytail: Centralized Supabase Storage Service to avoid duplicate client initialization across services.
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly supabase: SupabaseClient | null = null;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl =
      this.configService.get<string>("SUPABASE_URL") ||
      process.env.SUPABASE_URL ||
      "";
    const serviceRoleKey =
      this.configService.get<string>("SUPABASE_SERVICE_ROLE_KEY") ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      "";

    this.bucketName =
      this.configService.get<string>("SUPABASE_BUCKET") ||
      process.env.SUPABASE_BUCKET ||
      "attachments";

    if (supabaseUrl && serviceRoleKey) {
      this.supabase = createClient(supabaseUrl, serviceRoleKey);
    } else {
      this.logger.warn(
        "Supabase credentials not configured. File storage operations will be disabled.",
      );
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string | null> {
    if (!this.supabase || !file) return null;

    try {
      const fileExt = file.originalname
        ? file.originalname.split(".").pop()
        : "bin";
      const secureRandom = crypto.randomBytes(4).toString("hex");
      const fileName = `${Date.now()}-${secureRandom}.${fileExt}`;

      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        this.logger.error("Supabase upload error:", error);
        return null;
      }
      return data.path;
    } catch (e) {
      this.logger.error("Upload file exception:", e);
      return null;
    }
  }

  async uploadBase64(base64Data: string): Promise<string | null> {
    if (!this.supabase || !base64Data) return null;

    try {
      const match = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (match?.length !== 3) {
        return null;
      }

      const mimeType = match[1];
      const base64String = match[2];
      const buffer = Buffer.from(base64String, "base64");

      let extension = mimeType.split("/")[1] || "bin";
      if (extension === "jpeg") extension = "jpg";

      const secureRandom = crypto.randomBytes(4).toString("hex");
      const fileName = `${Date.now()}-${secureRandom}.${extension}`;

      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(fileName, buffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (error) {
        this.logger.error("Supabase base64 upload error:", error);
        return null;
      }
      return data.path;
    } catch (e) {
      this.logger.error("Upload base64 exception:", e);
      return null;
    }
  }

  async getSignedUrl(
    pathOrUrl: string | null | undefined,
    expiresInSeconds = 3600,
  ): Promise<string | null> {
    if (!this.supabase || !pathOrUrl) return null;

    try {
      let path = pathOrUrl;
      if (pathOrUrl.startsWith("http")) {
        const parts = pathOrUrl.split(`/${this.bucketName}/`);
        if (parts.length > 1) {
          path = parts[1];
        } else {
          return pathOrUrl;
        }
      }

      const { data } = await this.supabase.storage
        .from(this.bucketName)
        .createSignedUrl(path, expiresInSeconds);

      return data?.signedUrl || null;
    } catch (e) {
      this.logger.error("Failed to generate signed URL:", e);
      return null;
    }
  }

  getPublicUrl(path: string): string {
    if (!this.supabase || !path) return path;
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  async removeFile(attachmentUrl: string | null | undefined): Promise<void> {
    if (!this.supabase || !attachmentUrl) return;

    try {
      let path = attachmentUrl;
      if (path.startsWith("http")) {
        const parts = path.split(`/${this.bucketName}/`);
        if (parts.length > 1) {
          path = parts[1];
        }
      }
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([path]);
      if (error) {
        this.logger.error("Failed to delete attachment from Supabase:", error);
      }
    } catch (e) {
      this.logger.error("Remove file exception:", e);
    }
  }
}
