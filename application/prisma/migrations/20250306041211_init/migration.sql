-- CreateTable
CREATE TABLE "DelveRun" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "delveName" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "character" TEXT NOT NULL,
    "brannLevel" INTEGER NOT NULL,
    "brannSpec" TEXT NOT NULL,
    "combatCurios" TEXT,
    "utilityCurios" TEXT,
    "myItemLevel" TEXT NOT NULL,
    "bossKillTime" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "dateRun" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
