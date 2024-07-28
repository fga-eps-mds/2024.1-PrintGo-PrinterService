/*
  Warnings:

  - The primary key for the `Impressora` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cidade` on the `Impressora` table. All the data in the column will be lost.
  - You are about to drop the column `contadorInstalacao` on the `Impressora` table. All the data in the column will be lost.
  - You are about to drop the column `contadorRetirada` on the `Impressora` table. All the data in the column will be lost.
  - You are about to drop the column `contrato` on the `Impressora` table. All the data in the column will be lost.
  - You are about to drop the column `dentroRede` on the `Impressora` table. All the data in the column will be lost.
  - You are about to drop the column `marca` on the `Impressora` table. All the data in the column will be lost.
  - You are about to drop the column `modelo` on the `Impressora` table. All the data in the column will be lost.
  - You are about to drop the column `regional` on the `Impressora` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Impressora` table. All the data in the column will be lost.
  - You are about to drop the column `subestacao` on the `Impressora` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[numSerie]` on the table `Impressora` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[enderecoIp]` on the table `Impressora` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ativo` to the `Impressora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contadorAtualCor` to the `Impressora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contadorAtualPB` to the `Impressora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contadorInstalacaoCor` to the `Impressora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contadorInstalacaoPB` to the `Impressora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contadorRetiradaCor` to the `Impressora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contadorRetiradaPB` to the `Impressora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estaNaRede` to the `Impressora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localizacao` to the `Impressora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modeloId` to the `Impressora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numContrato` to the `Impressora` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Impressora" DROP CONSTRAINT "Impressora_pkey",
DROP COLUMN "cidade",
DROP COLUMN "contadorInstalacao",
DROP COLUMN "contadorRetirada",
DROP COLUMN "contrato",
DROP COLUMN "dentroRede",
DROP COLUMN "marca",
DROP COLUMN "modelo",
DROP COLUMN "regional",
DROP COLUMN "status",
DROP COLUMN "subestacao",
ADD COLUMN     "ativo" BOOLEAN NOT NULL,
ADD COLUMN     "contadorAtualCor" INTEGER NOT NULL,
ADD COLUMN     "contadorAtualPB" INTEGER NOT NULL,
ADD COLUMN     "contadorInstalacaoCor" INTEGER NOT NULL,
ADD COLUMN     "contadorInstalacaoPB" INTEGER NOT NULL,
ADD COLUMN     "contadorRetiradaCor" INTEGER NOT NULL,
ADD COLUMN     "contadorRetiradaPB" INTEGER NOT NULL,
ADD COLUMN     "estaNaRede" BOOLEAN NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "localizacao" TEXT NOT NULL,
ADD COLUMN     "modeloId" TEXT NOT NULL,
ADD COLUMN     "numContrato" TEXT NOT NULL,
ADD CONSTRAINT "Impressora_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "Status";

-- CreateIndex
CREATE UNIQUE INDEX "Impressora_numSerie_key" ON "Impressora"("numSerie");

-- CreateIndex
CREATE UNIQUE INDEX "Impressora_enderecoIp_key" ON "Impressora"("enderecoIp");
