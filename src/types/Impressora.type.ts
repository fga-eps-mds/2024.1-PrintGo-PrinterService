export const Status: {
    ATIVO: 'ATIVO'
    INATIVO: 'INATIVO'
} = {
    ATIVO: 'ATIVO',
    INATIVO: 'INATIVO',
}

export type Status = typeof Status[keyof typeof Status]

export type Impressora = {
    contrato: string;
    numSerie: string;
    enderecoIp: string;
    dentroRede: boolean;
    dataInstalacao: Date;
    dataRetirada?: Date;
    status: Status;
    marca: string;
    modelo: string;
    contadorInstalacao: number;
    contadorRetirada: number;
    cidade: string;
    regional: string;
    subestacao: string;
};

export type ImpressoraCreateInput = {
    ip: string;
    padrao_id: string;
    numeroSerie: string;
    codigoLocadora: string;
    contadorInstalacao: number;
    dataInstalacao: Date;
    contadorRetiradas: number;
    dataContadorRetirada: Date;
    ultimoContador: number;
    dataUltimoContador: Date;
    unidadeId?: string;
}
export type ImpressoraCreateOutput = {
    id: string;
    ip: string;
    padrao_id: string;
    numeroSerie: string;
    codigoLocadora: string;
    contadorInstalacao: number;
    dataInstalacao: Date;
    contadorRetiradas: number;
    dataContadorRetirada: Date;
    ultimoContador: number;
    dataUltimoContador: Date;
    unidadeId?: string;
}

export type ImpressoraUpdateInput = {
    ip?: string;
    padrao_id?: string;
    numeroSerie?: string;
    codigoLocadora?: string;
    contadorInstalacao?: number;
    dataInstalacao?: Date;
    contadorRetiradas?: number;
    dataContadorRetirada?: Date;
    ultimoContador?: number;
    dataUltimoContador?: Date;
    unidadeId?: string;
}

export type ImpressoraUpdateOutput = {
    id: string;
    padrao_id: string;
    ip: string;
    numeroSerie: string;
    codigoLocadora: string;

    contadorInstalacao: number;
    dataInstalacao: Date;

    contadorRetirada?: number;
    datacontadorRetirada?: Date;

    ultimoContador?: number;
    dataUltimoContador: Date;

    unidadeId?: string;
}

export type ImpressoraToggleInput = {
    id: string;
    status: string;
}

export type ImpressoraToggleOutput = {
    id: string;
    padrao_id: string;
    ip: string;
    numeroSerie: string;
    codigoLocadora: string;

    contadorInstalacao: number;
    dataInstalacao: Date;

    contadorRetirada?: number;
    datacontadorRetirada?: Date;

    ultimoContador?: number;
    dataUltimoContador: Date;

    unidadeId?: string;
    status: string;
}
