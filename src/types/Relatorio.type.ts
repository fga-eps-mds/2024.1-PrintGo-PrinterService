export type Relatorio = {
    id: number;
    impressoraId: number;
    contadorPB: number;
    contadorPBDiff: number;
    contadorCor: number;
    contadorCorDiff: number;
    ultimoResultado: number;
    resultadoAtual: number;
    ultimaAtualizacao: Date;
};

export interface RelatorioData {
    newReportDate: Date;
    lastReportDate: Date;
    printerSerial: string;
    contractNumber: string;
    installationDate: Date;
    blackWhiteCount: number;
    blackWhiteCountDiff: number;
    colorCount: number;
    colorCountDiff: number;
    location: string;
    model: string;
    previousGrowth: number;
    currentGrowth: number;
}

