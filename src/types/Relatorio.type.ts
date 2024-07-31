import { Impressora } from "@prisma/client";

export type Relatorio = {
    id: number;
    //impressora: Impressora;
    impressoraId: number;
    contadorMes: number;
    ultimoResultado: number;
    ultimaAtualizacao: Date;
};