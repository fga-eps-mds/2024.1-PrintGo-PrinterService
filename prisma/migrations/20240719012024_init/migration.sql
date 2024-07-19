-- CreateEnum
CREATE TYPE "ImpressoraStatus" AS ENUM ('ATIVO', 'DESATIVADO');

-- CreateEnum
CREATE TYPE "PadraoStatus" AS ENUM ('ATIVO', 'DESATIVADO');

-- CreateEnum
CREATE TYPE "Cargo" AS ENUM ('USER', 'ADMIN', 'LOCADORA');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "unidade_id" TEXT,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" TEXT,
    "cargos" "Cargo"[] DEFAULT ARRAY['USER']::"Cargo"[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "padroes" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modeloImpressora" TEXT,
    "modelo" TEXT NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "versaoFirmware" TEXT NOT NULL,
    "totalDigitalizacoes" TEXT NOT NULL,
    "totalCopiasPB" TEXT NOT NULL,
    "totalCopiasColoridas" TEXT NOT NULL,
    "totalImpressoesPb" TEXT NOT NULL,
    "totalImpressoesColoridas" TEXT NOT NULL,
    "totalGeral" TEXT NOT NULL,
    "enderecoIp" TEXT NOT NULL,
    "status" "PadraoStatus" NOT NULL DEFAULT 'ATIVO',
    "tempoAtivoSistema" TEXT NOT NULL,
    "num" TEXT,

    CONSTRAINT "padroes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impressoras" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "padrao_id" TEXT NOT NULL,
    "codigoLocadora" TEXT,
    "locadora_id" TEXT,
    "contadorInstalacao" INTEGER NOT NULL DEFAULT 0,
    "dataInstalacao" TIMESTAMP(3),
    "ultimoContador" INTEGER NOT NULL DEFAULT 0,
    "dataUltimoContador" TIMESTAMP(3),
    "contadorRetiradas" INTEGER NOT NULL DEFAULT 0,
    "dataContadorRetirada" TIMESTAMP(3),
    "unidadeId" TEXT,
    "status" "ImpressoraStatus" NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT "impressoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impressoes" (
    "id" TEXT NOT NULL,
    "impressora_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "data_impressao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome_documento" TEXT NOT NULL,
    "numero_paginas" INTEGER NOT NULL,

    CONSTRAINT "impressoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contadores" (
    "id" TEXT NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "contadorCopiasPB" TEXT NOT NULL,
    "contadorImpressoesPB" TEXT NOT NULL,
    "contadorCopiasColoridas" TEXT,
    "contadorImpressoesColoridas" TEXT,
    "contadorGeral" TEXT NOT NULL,
    "dataHoraEmissaoRelatorio" TIMESTAMP(3) NOT NULL,
    "pdfAnexo" TEXT,

    CONSTRAINT "contadores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "impressoras_ip_key" ON "impressoras"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "impressoras_numeroSerie_key" ON "impressoras"("numeroSerie");

-- AddForeignKey
ALTER TABLE "impressoras" ADD CONSTRAINT "impressoras_locadora_id_fkey" FOREIGN KEY ("locadora_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impressoras" ADD CONSTRAINT "impressoras_padrao_id_fkey" FOREIGN KEY ("padrao_id") REFERENCES "padroes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impressoes" ADD CONSTRAINT "impressoes_impressora_id_fkey" FOREIGN KEY ("impressora_id") REFERENCES "impressoras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impressoes" ADD CONSTRAINT "impressoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contadores" ADD CONSTRAINT "contadores_numeroSerie_fkey" FOREIGN KEY ("numeroSerie") REFERENCES "impressoras"("numeroSerie") ON DELETE RESTRICT ON UPDATE CASCADE;
