import Joi from 'joi';

const contadorValidation = Joi.number().integer().optional().custom((value, helpers) => {
  if (value < 0) {
      return helpers.message({custom: 'O numero do contador deve ser maior que zero!'});
  }
  return value;
}).default(0);

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
    dataRetirada: Joi.date().iso()
        .when('ativo', {
            is: true,
            then: Joi.optional().allow(null), // Torna a dataRetirada obrigatória quando status é ativo
            otherwise: Joi.required() // Não requer dataRetirada quando status não é ativo
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
    estaNaRede: Joi.boolean().optional(),
    dataInstalacao: Joi.date().iso().optional(),
    dataRetirada: Joi.date().iso()
        .when('ativo', {
            is: true,
            then: Joi.optional().allow(null), // Torna a dataRetirada obrigatória quando status é ativo
            otherwise: Joi.required() // Não requer dataRetirada quando status não é ativo
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

export const updateContadoresValidator = Joi.object({
    contadorAtualPB: contadorValidation,
    contadorAtualCor: contadorValidation,
    dataContador: Joi.date().iso().required()
});
