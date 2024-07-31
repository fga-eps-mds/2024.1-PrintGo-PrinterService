-- DropIndex
DROP INDEX "Impressora_enderecoIp_key";

-- CreateTable
CREATE TABLE "padroes" (
    "id" SERIAL NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "colorido" BOOLEAN NOT NULL,
    "oidModelo" TEXT,
    "oidNumeroSerie" TEXT,
    "oidFirmware" TEXT,
    "oidTempoAtivo" TEXT,
    "oidDigitalizacoes" TEXT,
    "oidCopiasPB" TEXT,
    "oidCopiasCor" TEXT,
    "oidTotalGeral" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "padroes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relatorio" (
    "id" SERIAL NOT NULL,
    "impressoraId" INTEGER NOT NULL,
    "contadorMes" INTEGER NOT NULL,
    "ultimoResultado" INTEGER NOT NULL,
    "ultimaAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Relatorio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "padroes_marca_modelo_key" ON "padroes"("marca", "modelo");

-- CreateIndex
CREATE UNIQUE INDEX "Relatorio_impressoraId_key" ON "Relatorio"("impressoraId");

-- AddForeignKey
ALTER TABLE "Relatorio" ADD CONSTRAINT "Relatorio_impressoraId_fkey" FOREIGN KEY ("impressoraId") REFERENCES "Impressora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
