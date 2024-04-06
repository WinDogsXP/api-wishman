-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hours" INTEGER NOT NULL DEFAULT 12,
    "isBugged" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Endpoint" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "headers" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "interval" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Stable',

    CONSTRAINT "Endpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EndpointCall" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "endpointId" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 200,
    "status" TEXT NOT NULL DEFAULT 'Stable',
    "responseBody" TEXT NOT NULL DEFAULT '',
    "responseHeader" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "EndpointCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BugReport" (
    "id" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solveDate" TIMESTAMP(3),
    "details" TEXT NOT NULL,
    "receiver" TEXT,
    "endpointId" TEXT NOT NULL,
    "appId" TEXT,

    CONSTRAINT "BugReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Endpoint" ADD CONSTRAINT "Endpoint_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EndpointCall" ADD CONSTRAINT "EndpointCall_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "Endpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;
