/*
  Warnings:

  - You are about to drop the `contadores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `impressoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `impressoras` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `padroes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATIVO', 'INATIVO');

-- DropForeignKey
ALTER TABLE "contadores" DROP CONSTRAINT "contadores_numeroSerie_fkey";

-- DropForeignKey
ALTER TABLE "impressoes" DROP CONSTRAINT "impressoes_impressora_id_fkey";

-- DropForeignKey
ALTER TABLE "impressoes" DROP CONSTRAINT "impressoes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "impressoras" DROP CONSTRAINT "impressoras_locadora_id_fkey";

-- DropForeignKey
ALTER TABLE "impressoras" DROP CONSTRAINT "impressoras_padrao_id_fkey";

-- DropTable
DROP TABLE "contadores";

-- DropTable
DROP TABLE "impressoes";

-- DropTable
DROP TABLE "impressoras";

-- DropTable
DROP TABLE "padroes";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "Cargo";

-- DropEnum
DROP TYPE "ImpressoraStatus";

-- DropEnum
DROP TYPE "PadraoStatus";

-- CreateTable
CREATE TABLE "Impressora" (
    "contrato" TEXT NOT NULL,
    "numSerie" TEXT NOT NULL,
    "enderecoIp" TEXT NOT NULL,
    "dentroRede" BOOLEAN NOT NULL,
    "dataInstalacao" TIMESTAMP(3) NOT NULL,
    "dataRetirada" TIMESTAMP(3),
    "status" "Status" NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "contadorInstalacao" INTEGER NOT NULL,
    "contadorRetirada" INTEGER NOT NULL,
    "cidade" TEXT NOT NULL,
    "regional" TEXT NOT NULL,
    "subestacao" TEXT NOT NULL,

    CONSTRAINT "Impressora_pkey" PRIMARY KEY ("numSerie")
);
