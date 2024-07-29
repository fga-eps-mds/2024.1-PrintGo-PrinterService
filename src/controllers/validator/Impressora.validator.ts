import Joi from 'joi';

export const createImpressoraValidator = Joi.object({
    numContrato: Joi.string().required(),
    numSerie: Joi.string().required(),
    enderecoIp: Joi.custom((value, helpers) => {
        const { estaNaRede } = helpers.state.ancestors[0];

        if (estaNaRede === false) {
            return '0.0.0.0';
        }

        if (estaNaRede === true && !Joi.string().ip().validate(value).error) {
            return value;
        }

        if (estaNaRede === true && Joi.string().ip().validate(value).error) {
            return helpers.message({'string.ip': 'enderecoIp deve ser um IP válido quando dentroRede é true'});
        }
    }),
    estaNaRede: Joi.boolean().required(),
    dataInstalacao: Joi.date().iso().required(),
    dataRetirada: Joi.date().allow(null).iso().optional()
        .when('ativo', {
            is: false,
            then: Joi.required(), // Torna a dataRetirada obrigatória quando status é inativo
            otherwise: Joi.forbidden() // Não requer dataRetirada quando status não é inativo
        }),
    ativo: Joi.boolean().required(),
    contadorInstalacaoPB: Joi.number().integer().required(),
    contadorInstalacaoCor: Joi.number().integer().required(),
    contadorAtualPB: Joi.number().integer().required(),
    contadorAtualCor: Joi.number().integer().required(),
    contadorRetiradaPB: Joi.number().integer().optional(),
    contadorRetiradaCor: Joi.number().integer().optional(),
    localizacao: Joi.string().required().custom((value, helpers) => {
        const parts = value.split(';');
        if (parts.length !== 3) {
            return helpers.message({custom: 'localizacao deve conter três partes (cidade, regional e subestação) separadas por ponto e vírgula'});
        }
        return value;
    }),
    modeloId: Joi.string().required(),
});

export const updateImpressoraValidator = Joi.object({
    numContrato: Joi.string().optional(),
    numSerie: Joi.string().optional(),
    enderecoIp: Joi.string().custom((value, helpers) => {
        const { estaNaRede } = helpers.state.ancestors[0];

        // Se estaNaRede é false e enderecoIp não é '0.0.0.0', define o valor como '0.0.0.0'
        if (estaNaRede === false && value !== '0.0.0.0') {
            return '0.0.0.0';
        }

        // Se estaNaRede é true, valida o enderecoIp
        if (estaNaRede === true && !Joi.string().ip().validate(value).error) {
            return value; // Retorna o valor validado se for um IP válido
        }

        // Se estaNaRede é true e enderecoIp não é válido, retorna um erro de validação
        // if (estaNaRede === true && Joi.string().ip().validate(value).error) {
        //     return helpers.message('enderecoIp deve ser um IP válido quando estaNaRede é true');
        // }

        // Caso contrário, retorna o valor como está
        return value;
    }),
    estaNaRede: Joi.boolean().optional(),
    dataInstalacao: Joi.date().iso().optional(),
    dataRetirada: Joi.date().allow(null).iso().optional()
        .when('ativo', {
            is: true,
            then: Joi.optional(), // Torna a dataRetirada obrigatória quando status é ativo
            otherwise: Joi.forbidden() // Não requer dataRetirada quando status não é ativo
        }),
    ativo: Joi.boolean().optional(),
    contadorInstalacaoPB: Joi.number().integer().optional(),
    contadorInstalacaoCor: Joi.number().integer().optional(),
    contadorAtualPB: Joi.number().integer().optional(),
    contadorAtualCor: Joi.number().integer().optional(),
    contadorRetiradaPB: Joi.number().integer().optional(),
    contadorRetiradaCor: Joi.number().integer().optional(),
    localizacao: Joi.string().optional().custom((value, helpers) => {
        const parts = value.split(';');
        if (parts.length !== 3) {
            return helpers.message({custom: 'localizacao deve conter três partes (cidade, regional e subestação) separadas por ponto e vírgula'});
        }
        return value;
    }),
    modeloId: Joi.string().optional(),
});
