-- CreateEnum
CREATE TYPE "Language" AS ENUM ('BENGALI', 'ENGLISH', 'BILINGUAL');

-- CreateEnum
CREATE TYPE "Copyright" AS ENUM ('CREATOR', 'CC_BY', 'CC_BY_SA', 'PUBLIC_DOMAIN');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LOVE', 'INSIGHTFUL', 'NOSTALGIC', 'INSPIRING');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ContentStatus" ADD VALUE 'SUBMITTED';
ALTER TYPE "ContentStatus" ADD VALUE 'IN_REVIEW';
ALTER TYPE "ContentStatus" ADD VALUE 'CHANGES_REQUESTED';
ALTER TYPE "ContentStatus" ADD VALUE 'APPROVED';
ALTER TYPE "ContentStatus" ADD VALUE 'REJECTED';
ALTER TYPE "ContentStatus" ADD VALUE 'SCHEDULED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ContentType" ADD VALUE 'VIDEO';
ALTER TYPE "ContentType" ADD VALUE 'AUDIO';
ALTER TYPE "ContentType" ADD VALUE 'MULTIMEDIA';

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'CREATOR';

-- CreateTable
CREATE TABLE "stories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_bn" TEXT,
    "title_en" TEXT,
    "abstract" TEXT NOT NULL,
    "abstract_bn" TEXT,
    "abstract_en" TEXT,
    "body" JSONB NOT NULL,
    "body_bn" JSONB,
    "body_en" JSONB,
    "thumbnail" TEXT,
    "thumbnail_alt" TEXT,
    "category_id" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "scheduled_for" TIMESTAMP(3),
    "expiry_date" TIMESTAMP(3),
    "author_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'BILINGUAL',
    "contentType" "ContentType" NOT NULL DEFAULT 'ARTICLE',
    "reading_time" INTEGER NOT NULL DEFAULT 0,
    "word_count" INTEGER NOT NULL DEFAULT 0,
    "copyright" "Copyright" NOT NULL DEFAULT 'CREATOR',
    "allow_comments" BOOLEAN NOT NULL DEFAULT true,
    "allow_sharing" BOOLEAN NOT NULL DEFAULT true,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "unique_visitors" INTEGER NOT NULL DEFAULT 0,
    "reaction_count" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "share_count" INTEGER NOT NULL DEFAULT 0,
    "bookmark_count" INTEGER NOT NULL DEFAULT 0,
    "review_notes" TEXT,
    "reviewer_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_tags" (
    "story_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "story_tags_pkey" PRIMARY KEY ("story_id","tag_id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "storage_provider" TEXT,
    "storage_key" TEXT,
    "alt_text" TEXT,
    "caption" TEXT,
    "credit" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_media" (
    "id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "story_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "coordinates" JSONB,
    "area" TEXT,
    "is_historical" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_analytics" (
    "id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "unique_visitors" INTEGER NOT NULL DEFAULT 0,
    "avg_time_on_page" INTEGER NOT NULL DEFAULT 0,
    "completion_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounce_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avg_scroll_depth" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reactions" JSONB NOT NULL DEFAULT '{}',
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" JSONB NOT NULL DEFAULT '{}',
    "bookmarks" INTEGER NOT NULL DEFAULT 0,
    "top_locations" JSONB NOT NULL DEFAULT '[]',
    "devices" JSONB NOT NULL DEFAULT '{}',
    "referrals" JSONB NOT NULL DEFAULT '{}',
    "languages" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "story_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creator_analytics" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "total_stories" INTEGER NOT NULL DEFAULT 0,
    "published_stories" INTEGER NOT NULL DEFAULT 0,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "total_reactions" INTEGER NOT NULL DEFAULT 0,
    "total_comments" INTEGER NOT NULL DEFAULT 0,
    "total_shares" INTEGER NOT NULL DEFAULT 0,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "follower_growth" INTEGER NOT NULL DEFAULT 0,
    "earnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "support_count" INTEGER NOT NULL DEFAULT 0,
    "avg_support" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avg_engagement_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avg_completion_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creator_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "user_id" TEXT,
    "type" "ReactionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_comments" (
    "id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "user_id" TEXT,
    "content" TEXT NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "story_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources" (
    "id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "url" TEXT,
    "date_accessed" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reader_support" (
    "id" TEXT NOT NULL,
    "story_id" TEXT,
    "creator_id" TEXT NOT NULL,
    "supporter_id" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "message" TEXT,
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "payment_id" TEXT,
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "payment_method" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reader_support_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CoAuthoredStories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LocationToStory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "stories_slug_key" ON "stories"("slug");

-- CreateIndex
CREATE INDEX "stories_author_id_idx" ON "stories"("author_id");

-- CreateIndex
CREATE INDEX "stories_category_id_idx" ON "stories"("category_id");

-- CreateIndex
CREATE INDEX "stories_status_idx" ON "stories"("status");

-- CreateIndex
CREATE INDEX "stories_slug_idx" ON "stories"("slug");

-- CreateIndex
CREATE INDEX "stories_published_at_idx" ON "stories"("published_at");

-- CreateIndex
CREATE INDEX "stories_reviewer_id_idx" ON "stories"("reviewer_id");

-- CreateIndex
CREATE INDEX "story_tags_story_id_idx" ON "story_tags"("story_id");

-- CreateIndex
CREATE INDEX "story_tags_tag_id_idx" ON "story_tags"("tag_id");

-- CreateIndex
CREATE INDEX "media_user_id_idx" ON "media"("user_id");

-- CreateIndex
CREATE INDEX "media_type_idx" ON "media"("type");

-- CreateIndex
CREATE INDEX "story_media_story_id_idx" ON "story_media"("story_id");

-- CreateIndex
CREATE INDEX "story_media_media_id_idx" ON "story_media"("media_id");

-- CreateIndex
CREATE UNIQUE INDEX "story_media_story_id_media_id_key" ON "story_media"("story_id", "media_id");

-- CreateIndex
CREATE INDEX "locations_area_idx" ON "locations"("area");

-- CreateIndex
CREATE UNIQUE INDEX "locations_name_area_key" ON "locations"("name", "area");

-- CreateIndex
CREATE INDEX "story_analytics_story_id_idx" ON "story_analytics"("story_id");

-- CreateIndex
CREATE INDEX "story_analytics_date_idx" ON "story_analytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "story_analytics_story_id_date_key" ON "story_analytics"("story_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "creator_analytics_user_id_key" ON "creator_analytics"("user_id");

-- CreateIndex
CREATE INDEX "creator_analytics_user_id_idx" ON "creator_analytics"("user_id");

-- CreateIndex
CREATE INDEX "creator_analytics_date_idx" ON "creator_analytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "creator_analytics_user_id_date_key" ON "creator_analytics"("user_id", "date");

-- CreateIndex
CREATE INDEX "reactions_story_id_idx" ON "reactions"("story_id");

-- CreateIndex
CREATE INDEX "reactions_user_id_idx" ON "reactions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_story_id_user_id_type_key" ON "reactions"("story_id", "user_id", "type");

-- CreateIndex
CREATE INDEX "story_comments_story_id_idx" ON "story_comments"("story_id");

-- CreateIndex
CREATE INDEX "story_comments_user_id_idx" ON "story_comments"("user_id");

-- CreateIndex
CREATE INDEX "story_comments_parent_id_idx" ON "story_comments"("parent_id");

-- CreateIndex
CREATE INDEX "sources_story_id_idx" ON "sources"("story_id");

-- CreateIndex
CREATE UNIQUE INDEX "reader_support_payment_id_key" ON "reader_support"("payment_id");

-- CreateIndex
CREATE INDEX "reader_support_creator_id_idx" ON "reader_support"("creator_id");

-- CreateIndex
CREATE INDEX "reader_support_supporter_id_idx" ON "reader_support"("supporter_id");

-- CreateIndex
CREATE INDEX "reader_support_story_id_idx" ON "reader_support"("story_id");

-- CreateIndex
CREATE UNIQUE INDEX "_CoAuthoredStories_AB_unique" ON "_CoAuthoredStories"("A", "B");

-- CreateIndex
CREATE INDEX "_CoAuthoredStories_B_index" ON "_CoAuthoredStories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LocationToStory_AB_unique" ON "_LocationToStory"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationToStory_B_index" ON "_LocationToStory"("B");

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_tags" ADD CONSTRAINT "story_tags_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_tags" ADD CONSTRAINT "story_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_media" ADD CONSTRAINT "story_media_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_media" ADD CONSTRAINT "story_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_analytics" ADD CONSTRAINT "story_analytics_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creator_analytics" ADD CONSTRAINT "creator_analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_comments" ADD CONSTRAINT "story_comments_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_comments" ADD CONSTRAINT "story_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_comments" ADD CONSTRAINT "story_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "story_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sources" ADD CONSTRAINT "sources_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reader_support" ADD CONSTRAINT "reader_support_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reader_support" ADD CONSTRAINT "reader_support_supporter_id_fkey" FOREIGN KEY ("supporter_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoAuthoredStories" ADD CONSTRAINT "_CoAuthoredStories_A_fkey" FOREIGN KEY ("A") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoAuthoredStories" ADD CONSTRAINT "_CoAuthoredStories_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToStory" ADD CONSTRAINT "_LocationToStory_A_fkey" FOREIGN KEY ("A") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToStory" ADD CONSTRAINT "_LocationToStory_B_fkey" FOREIGN KEY ("B") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
