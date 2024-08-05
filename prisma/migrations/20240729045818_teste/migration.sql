-- CreateTable
CREATE TABLE "Impressora" (
    "id" SERIAL NOT NULL,
    "numContrato" TEXT NOT NULL,
    "numSerie" TEXT NOT NULL,
    "enderecoIp" TEXT NOT NULL,
    "estaNaRede" BOOLEAN NOT NULL,
    "dataInstalacao" TIMESTAMP(3) NOT NULL,
    "dataRetirada" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL,
    "contadorInstalacaoPB" INTEGER NOT NULL,
    "contadorInstalacaoCor" INTEGER NOT NULL,
    "contadorAtualPB" INTEGER NOT NULL,
    "contadorAtualCor" INTEGER NOT NULL,
    "contadorRetiradaPB" INTEGER NOT NULL,
    "contadorRetiradaCor" INTEGER NOT NULL,
    "localizacao" TEXT NOT NULL,
    "modeloId" TEXT NOT NULL,

    CONSTRAINT "Impressora_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Impressora_numSerie_key" ON "Impressora"("numSerie");
