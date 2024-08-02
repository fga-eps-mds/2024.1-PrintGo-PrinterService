import { Relatorio } from './Relatorio.type';

export type Impressora = {
    id: number;
    numContrato: string;
    numSerie: string;
    enderecoIp: string;
    estaNaRede: boolean;
    dataInstalacao: Date;
    dataRetirada?: Date;
    ativo: boolean;
    contadorInstalacaoPB: number;
    contadorInstalacaoCor: number;
    contadorAtualPB: number;
    contadorAtualCor: number;
    contadorRetiradaPB?: number;
    contadorRetiradaCor?: number;
    localizacao: string;
    modeloId: string;
    relatorio?: Relatorio;
};
