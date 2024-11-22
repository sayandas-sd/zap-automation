-- CreateTable
CREATE TABLE "TaskRunOut" (
    "id" TEXT NOT NULL,
    "taskRunId" TEXT NOT NULL,

    CONSTRAINT "TaskRunOut_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskRunOut_taskRunId_key" ON "TaskRunOut"("taskRunId");

-- AddForeignKey
ALTER TABLE "TaskRunOut" ADD CONSTRAINT "TaskRunOut_taskRunId_fkey" FOREIGN KEY ("taskRunId") REFERENCES "TaskRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
