ALTER TABLE "User"
ADD COLUMN "syncRevision" INTEGER NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION bump_user_sync_revision()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  affected_user_id TEXT;
BEGIN
  affected_user_id := CASE
    WHEN TG_OP = 'DELETE' THEN OLD."userId"
    ELSE NEW."userId"
  END;

  UPDATE "User"
  SET "syncRevision" = "syncRevision" + 1
  WHERE "id" = affected_user_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER asset_sync_revision_trigger
AFTER INSERT OR UPDATE OR DELETE ON "Asset"
FOR EACH ROW EXECUTE FUNCTION bump_user_sync_revision();

CREATE TRIGGER category_sync_revision_trigger
AFTER INSERT OR UPDATE OR DELETE ON "Category"
FOR EACH ROW EXECUTE FUNCTION bump_user_sync_revision();

CREATE TRIGGER transaction_sync_revision_trigger
AFTER INSERT OR UPDATE OR DELETE ON "Transaction"
FOR EACH ROW EXECUTE FUNCTION bump_user_sync_revision();
