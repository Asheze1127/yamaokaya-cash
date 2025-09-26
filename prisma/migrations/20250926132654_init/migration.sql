-- CreateEnum
CREATE TYPE "public"."NoodleHardness" AS ENUM ('HARD', 'NORMAL', 'SOFT');

-- CreateEnum
CREATE TYPE "public"."OilAmount" AS ENUM ('EXTRA', 'NORMAL', 'LESS');

-- CreateEnum
CREATE TYPE "public"."TasteLevel" AS ENUM ('STRONG', 'NORMAL', 'LIGHT');

-- CreateEnum
CREATE TYPE "public"."SustainableState" AS ENUM ('STAY', 'TRUE', 'FALSE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sustainablePoints" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Post" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "noodleHard" "public"."NoodleHardness" NOT NULL,
    "oilAmount" "public"."OilAmount" NOT NULL,
    "tasteLevel" "public"."TasteLevel" NOT NULL,
    "photoBefore" TEXT NOT NULL,
    "photoAfter" TEXT NOT NULL,
    "sustainable" "public"."SustainableState" NOT NULL DEFAULT 'STAY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "public"."Like"("userId", "postId");

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
