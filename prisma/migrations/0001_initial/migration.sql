-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "HcpProfile" (
    "id" TEXT NOT NULL,
    "npi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "credentials" TEXT,
    "gender" TEXT,
    "photoUrl" TEXT,
    "ageRange" TEXT,
    "primarySpecialty" TEXT,
    "subSpecialty" TEXT,
    "boardCertifications" TEXT[],
    "yearsInPractice" INTEGER,
    "medicalSchool" TEXT,
    "residency" TEXT,
    "enumerationDate" TIMESTAMP(3),
    "npiStatus" TEXT NOT NULL DEFAULT 'pending',
    "enrichmentStatus" TEXT NOT NULL DEFAULT 'pending',
    "profileCompleteness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HcpProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HcpLocation" (
    "id" TEXT NOT NULL,
    "hcpId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "phone" TEXT,
    "fax" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HcpLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HcpAffiliation" (
    "id" TEXT NOT NULL,
    "hcpId" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "role" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HcpAffiliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HcpPublication" (
    "id" TEXT NOT NULL,
    "hcpId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "journal" TEXT,
    "year" INTEGER,
    "pmid" TEXT,
    "coAuthors" TEXT[],
    "meshTerms" TEXT[],
    "therapeuticArea" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HcpPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HcpSocialProfile" (
    "id" TEXT NOT NULL,
    "hcpId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "profileUrl" TEXT NOT NULL,
    "username" TEXT,
    "followers" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isKol" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HcpSocialProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HcpPrescribingData" (
    "id" TEXT NOT NULL,
    "hcpId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "therapeuticArea" TEXT,
    "drugName" TEXT,
    "claimCount" INTEGER,
    "totalCost" DOUBLE PRECISION,
    "year" INTEGER,
    "paymentAmount" DOUBLE PRECISION,
    "paymentType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HcpPrescribingData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpiUpload" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileName" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "totalRows" INTEGER NOT NULL,
    "validNpis" INTEGER NOT NULL,
    "invalidNpis" INTEGER NOT NULL,
    "duplicates" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',

    CONSTRAINT "NpiUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpiUploadItem" (
    "id" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "hcpId" TEXT,
    "npi" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NpiUploadItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachPlan" (
    "id" TEXT NOT NULL,
    "hcpId" TEXT NOT NULL,
    "persona" JSONB,
    "strategy" JSONB,
    "channelMix" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnrichmentLog" (
    "id" TEXT NOT NULL,
    "hcpId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "source" TEXT,
    "dataPoints" INTEGER,
    "error" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnrichmentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalTrial" (
    "id" TEXT NOT NULL,
    "hcpId" TEXT NOT NULL,
    "trialId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "phase" TEXT,
    "condition" TEXT,
    "intervention" TEXT,
    "sponsor" TEXT,
    "status" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicalTrial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationLog" (
    "id" TEXT NOT NULL,
    "hcpId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "tokenCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProprietaryData" (
    "id" TEXT NOT NULL,
    "hcpId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "rawData" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProprietaryData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "demoMode" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HcpProfile_npi_key" ON "HcpProfile"("npi");

-- CreateIndex
CREATE INDEX "HcpProfile_primarySpecialty_idx" ON "HcpProfile"("primarySpecialty");

-- CreateIndex
CREATE INDEX "HcpProfile_npiStatus_idx" ON "HcpProfile"("npiStatus");

-- CreateIndex
CREATE INDEX "HcpProfile_enrichmentStatus_idx" ON "HcpProfile"("enrichmentStatus");

-- CreateIndex
CREATE INDEX "HcpProfile_isDemo_idx" ON "HcpProfile"("isDemo");

-- CreateIndex
CREATE INDEX "HcpProfile_lastName_firstName_idx" ON "HcpProfile"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "HcpProfile_createdAt_idx" ON "HcpProfile"("createdAt");

-- CreateIndex
CREATE INDEX "HcpProfile_updatedAt_idx" ON "HcpProfile"("updatedAt");

-- CreateIndex
CREATE INDEX "HcpLocation_hcpId_idx" ON "HcpLocation"("hcpId");

-- CreateIndex
CREATE INDEX "HcpLocation_state_idx" ON "HcpLocation"("state");

-- CreateIndex
CREATE INDEX "HcpLocation_zipCode_idx" ON "HcpLocation"("zipCode");

-- CreateIndex
CREATE INDEX "HcpAffiliation_hcpId_idx" ON "HcpAffiliation"("hcpId");

-- CreateIndex
CREATE INDEX "HcpAffiliation_type_idx" ON "HcpAffiliation"("type");

-- CreateIndex
CREATE UNIQUE INDEX "HcpPublication_pmid_key" ON "HcpPublication"("pmid");

-- CreateIndex
CREATE INDEX "HcpPublication_hcpId_idx" ON "HcpPublication"("hcpId");

-- CreateIndex
CREATE INDEX "HcpPublication_year_idx" ON "HcpPublication"("year");

-- CreateIndex
CREATE INDEX "HcpSocialProfile_hcpId_idx" ON "HcpSocialProfile"("hcpId");

-- CreateIndex
CREATE INDEX "HcpSocialProfile_platform_idx" ON "HcpSocialProfile"("platform");

-- CreateIndex
CREATE INDEX "HcpPrescribingData_hcpId_idx" ON "HcpPrescribingData"("hcpId");

-- CreateIndex
CREATE INDEX "HcpPrescribingData_therapeuticArea_idx" ON "HcpPrescribingData"("therapeuticArea");

-- CreateIndex
CREATE INDEX "HcpPrescribingData_source_idx" ON "HcpPrescribingData"("source");

-- CreateIndex
CREATE INDEX "NpiUploadItem_npi_idx" ON "NpiUploadItem"("npi");

-- CreateIndex
CREATE INDEX "EnrichmentLog_hcpId_idx" ON "EnrichmentLog"("hcpId");

-- CreateIndex
CREATE INDEX "EnrichmentLog_stage_idx" ON "EnrichmentLog"("stage");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalTrial_hcpId_trialId_key" ON "ClinicalTrial"("hcpId", "trialId");

-- CreateIndex
CREATE INDEX "ConversationLog_hcpId_channel_idx" ON "ConversationLog"("hcpId", "channel");

-- CreateIndex
CREATE INDEX "ConversationLog_createdAt_idx" ON "ConversationLog"("createdAt");

-- CreateIndex
CREATE INDEX "ProprietaryData_hcpId_source_idx" ON "ProprietaryData"("hcpId", "source");

-- AddForeignKey
ALTER TABLE "HcpLocation" ADD CONSTRAINT "HcpLocation_hcpId_fkey" FOREIGN KEY ("hcpId") REFERENCES "HcpProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HcpAffiliation" ADD CONSTRAINT "HcpAffiliation_hcpId_fkey" FOREIGN KEY ("hcpId") REFERENCES "HcpProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HcpPublication" ADD CONSTRAINT "HcpPublication_hcpId_fkey" FOREIGN KEY ("hcpId") REFERENCES "HcpProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HcpSocialProfile" ADD CONSTRAINT "HcpSocialProfile_hcpId_fkey" FOREIGN KEY ("hcpId") REFERENCES "HcpProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HcpPrescribingData" ADD CONSTRAINT "HcpPrescribingData_hcpId_fkey" FOREIGN KEY ("hcpId") REFERENCES "HcpProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpiUploadItem" ADD CONSTRAINT "NpiUploadItem_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "NpiUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpiUploadItem" ADD CONSTRAINT "NpiUploadItem_hcpId_fkey" FOREIGN KEY ("hcpId") REFERENCES "HcpProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutreachPlan" ADD CONSTRAINT "OutreachPlan_hcpId_fkey" FOREIGN KEY ("hcpId") REFERENCES "HcpProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrichmentLog" ADD CONSTRAINT "EnrichmentLog_hcpId_fkey" FOREIGN KEY ("hcpId") REFERENCES "HcpProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalTrial" ADD CONSTRAINT "ClinicalTrial_hcpId_fkey" FOREIGN KEY ("hcpId") REFERENCES "HcpProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationLog" ADD CONSTRAINT "ConversationLog_hcpId_fkey" FOREIGN KEY ("hcpId") REFERENCES "HcpProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProprietaryData" ADD CONSTRAINT "ProprietaryData_hcpId_fkey" FOREIGN KEY ("hcpId") REFERENCES "HcpProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

