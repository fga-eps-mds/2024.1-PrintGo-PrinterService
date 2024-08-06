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

-- CreateTable
CREATE TABLE "Relatorio" (
    "id" SERIAL NOT NULL,
    "impressoraId" INTEGER NOT NULL,
    "contadorPB" INTEGER NOT NULL,
    "contadorPBDiff" INTEGER NOT NULL,
    "contadorCor" INTEGER NOT NULL,
    "contadorCorDiff" INTEGER NOT NULL,
    "ultimoResultado" INTEGER NOT NULL,
    "resultadoAtual" INTEGER NOT NULL,
    "ultimaAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Relatorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelatorioLocadora" (
    "id" SERIAL NOT NULL,
    "impressoraId" INTEGER NOT NULL,
    "contadorPB" INTEGER NOT NULL,
    "contadorCor" INTEGER NOT NULL,
    "contadorTotal" INTEGER NOT NULL,

    CONSTRAINT "RelatorioLocadora_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "padroes_marca_modelo_key" ON "padroes"("marca", "modelo");

-- CreateIndex
CREATE UNIQUE INDEX "Impressora_numSerie_key" ON "Impressora"("numSerie");

-- CreateIndex
CREATE UNIQUE INDEX "Relatorio_impressoraId_key" ON "Relatorio"("impressoraId");

-- CreateIndex
CREATE UNIQUE INDEX "RelatorioLocadora_impressoraId_key" ON "RelatorioLocadora"("impressoraId");

-- AddForeignKey
ALTER TABLE "Relatorio" ADD CONSTRAINT "Relatorio_impressoraId_fkey" FOREIGN KEY ("impressoraId") REFERENCES "Impressora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatorioLocadora" ADD CONSTRAINT "RelatorioLocadora_impressoraId_fkey" FOREIGN KEY ("impressoraId") REFERENCES "Impressora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
