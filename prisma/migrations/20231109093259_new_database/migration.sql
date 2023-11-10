-- CreateTable
CREATE TABLE "province" (
    "pkProvince" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "province_pkey" PRIMARY KEY ("pkProvince")
);

-- CreateTable
CREATE TABLE "county" (
    "pkCounty" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "fkProvince" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "county_pkey" PRIMARY KEY ("pkCounty")
);

-- CreateTable
CREATE TABLE "district" (
    "pkDistrict" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "fkCounty" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "district_pkey" PRIMARY KEY ("pkDistrict")
);

-- CreateTable
CREATE TABLE "locality" (
    "pkLocality" TEXT NOT NULL,
    "fkDistrict" TEXT,
    "neighborhood" TEXT NOT NULL,
    "road" TEXT NOT NULL,
    "houseNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locality_pkey" PRIMARY KEY ("pkLocality")
);

-- CreateTable
CREATE TABLE "persons" (
    "pkPerson" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "identifyCardNumber" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "fkLocality" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("pkPerson")
);

-- CreateTable
CREATE TABLE "typeofaccount" (
    "pkTypeOfAccount" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "typeofaccount_pkey" PRIMARY KEY ("pkTypeOfAccount")
);

-- CreateTable
CREATE TABLE "accounts" (
    "pkAccount" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fkPerson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("pkAccount")
);

-- CreateTable
CREATE TABLE "accounttypeofaccount" (
    "pkAccountTypeOfAccount" TEXT NOT NULL,
    "fkAccount" TEXT NOT NULL,
    "fkTypeOfAccount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounttypeofaccount_pkey" PRIMARY KEY ("pkAccountTypeOfAccount")
);

-- CreateTable
CREATE TABLE "typology" (
    "pkTypology" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "typology_pkey" PRIMARY KEY ("pkTypology")
);

-- CreateTable
CREATE TABLE "residences" (
    "pkResidence" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "pricePerMonth" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "isFurnished" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "fkOwner" TEXT NOT NULL,
    "fkLocality" TEXT NOT NULL,
    "fkTypology" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "residences_pkey" PRIMARY KEY ("pkResidence")
);

-- CreateTable
CREATE TABLE "photos" (
    "pkPhoto" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fkResidence" TEXT NOT NULL,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("pkPhoto")
);

-- CreateTable
CREATE TABLE "typeofcontract" (
    "pkTypeOfContract" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "typeofcontract_pkey" PRIMARY KEY ("pkTypeOfContract")
);

-- CreateTable
CREATE TABLE "contracts" (
    "pkContract" TEXT NOT NULL,
    "fkTypeOfContract" TEXT NOT NULL,
    "fkResidence" TEXT NOT NULL,
    "fkClient" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("pkContract")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_fkPerson_key" ON "accounts"("fkPerson");

-- CreateIndex
CREATE UNIQUE INDEX "accounttypeofaccount_fkAccount_key" ON "accounttypeofaccount"("fkAccount");

-- AddForeignKey
ALTER TABLE "county" ADD CONSTRAINT "county_fkProvince_fkey" FOREIGN KEY ("fkProvince") REFERENCES "province"("pkProvince") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "district_fkCounty_fkey" FOREIGN KEY ("fkCounty") REFERENCES "county"("pkCounty") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locality" ADD CONSTRAINT "locality_fkDistrict_fkey" FOREIGN KEY ("fkDistrict") REFERENCES "district"("pkDistrict") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_fkLocality_fkey" FOREIGN KEY ("fkLocality") REFERENCES "locality"("pkLocality") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_fkPerson_fkey" FOREIGN KEY ("fkPerson") REFERENCES "persons"("pkPerson") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounttypeofaccount" ADD CONSTRAINT "accounttypeofaccount_fkAccount_fkey" FOREIGN KEY ("fkAccount") REFERENCES "accounts"("pkAccount") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounttypeofaccount" ADD CONSTRAINT "accounttypeofaccount_fkTypeOfAccount_fkey" FOREIGN KEY ("fkTypeOfAccount") REFERENCES "typeofaccount"("pkTypeOfAccount") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residences" ADD CONSTRAINT "residences_fkOwner_fkey" FOREIGN KEY ("fkOwner") REFERENCES "persons"("pkPerson") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residences" ADD CONSTRAINT "residences_fkLocality_fkey" FOREIGN KEY ("fkLocality") REFERENCES "locality"("pkLocality") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residences" ADD CONSTRAINT "residences_fkTypology_fkey" FOREIGN KEY ("fkTypology") REFERENCES "typology"("pkTypology") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_fkResidence_fkey" FOREIGN KEY ("fkResidence") REFERENCES "residences"("pkResidence") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_fkTypeOfContract_fkey" FOREIGN KEY ("fkTypeOfContract") REFERENCES "typeofcontract"("pkTypeOfContract") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_fkResidence_fkey" FOREIGN KEY ("fkResidence") REFERENCES "residences"("pkResidence") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_fkClient_fkey" FOREIGN KEY ("fkClient") REFERENCES "accounts"("pkAccount") ON DELETE RESTRICT ON UPDATE CASCADE;
