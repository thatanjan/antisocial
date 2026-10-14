-- AlterTable
-- Change Notification FK delete behavior: actor + post now CASCADE on reference delete.
-- (recipient already Cascades.)

-- Drop existing foreign keys
ALTER TABLE "notification" DROP CONSTRAINT "notification_postId_fkey";
ALTER TABLE "notification" DROP CONSTRAINT "notification_actorId_fkey";

-- Re-add with CASCADE on delete
ALTER TABLE "notification"
  ADD CONSTRAINT "notification_postId_fkey"
  FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notification"
  ADD CONSTRAINT "notification_actorId_fkey"
  FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;