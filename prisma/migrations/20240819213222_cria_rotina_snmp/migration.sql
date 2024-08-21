-- CreateTable
CREATE TABLE "RotinaSnmp" (
    "id" SERIAL NOT NULL,
    "localizacao" TEXT,
    "dataCriado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataUltimoUpdate" TIMESTAMP(3),
    "cronExpression" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "cidadeTodas" BOOLEAN,
    "regionalTodas" BOOLEAN,
    "unidadeTodas" BOOLEAN,

    CONSTRAINT "RotinaSnmp_pkey" PRIMARY KEY ("id")
);
