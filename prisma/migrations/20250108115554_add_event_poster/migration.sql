-- CreateTable
CREATE TABLE "EventPoster" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "EventPoster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventPoster_eventId_key" ON "EventPoster"("eventId");

-- AddForeignKey
ALTER TABLE "EventPoster" ADD CONSTRAINT "EventPoster_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
