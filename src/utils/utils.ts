export const nthIndexOf = (str: string, pattern: string, n: number): number => {
    var i = -1;
    while (n-- && i++ < str.length) {
        i = str.indexOf(pattern, i);
        if (i < 0) break;
    }
    return i;
}

export const getLocalizacaoQuery = (localizacao: string, cidadeTodas: boolean, regionalTodas: boolean, unidadeTodas: boolean): string => {
    var localizacaoQuery = localizacao;

    if (localizacao == null || cidadeTodas) {
        localizacaoQuery = undefined;
    }
    else if (regionalTodas) {
        localizacaoQuery = localizacao.substring(0, nthIndexOf(localizacao, ';', 1) + 1);
    }
    else if (unidadeTodas) {
        localizacaoQuery = localizacao.substring(0, nthIndexOf(localizacao, ';', 2) + 1);
    }
    else {
        localizacaoQuery = localizacao;
    }

    return localizacaoQuery;
}
