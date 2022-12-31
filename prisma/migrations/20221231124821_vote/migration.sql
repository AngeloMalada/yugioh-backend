-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote" (
    "id" SERIAL NOT NULL,
    "againstId" INTEGER NOT NULL,
    "forId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vote_forId_idx" ON "vote"("forId");

-- CreateIndex
CREATE INDEX "vote_againstId_idx" ON "vote"("againstId");

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_againstId_fkey" FOREIGN KEY ("againstId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_forId_fkey" FOREIGN KEY ("forId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
