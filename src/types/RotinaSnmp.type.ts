export type RotinaSnmp = {
    id?: number;
    localizacao?: string | null;
    dataCriado?: Date;
    dataUltimoUpdate?: Date | null;
    cronExpression: string;
    ativo: boolean;
    cidadeTodas?: boolean | null;
    regionalTodas?: boolean | null;
    unidadeTodas?: boolean | null;
}
