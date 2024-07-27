import Joi from 'joi';

export const createImpressoraValidator = Joi.object({
    contrato: Joi.string().required(),
    numSerie: Joi.string().required(),

    enderecoIp: Joi.custom((value, helpers) => {
        const { dentroRede } = helpers.state.ancestors[0];

        if (dentroRede === false) {
            return '0.0.0.0';
        }

        if (dentroRede === true && !Joi.string().ip().validate(value).error) {
            return value;
        }

        if (dentroRede === true && Joi.string().ip().validate(value).error) {
            return helpers.message({'string.ip': 'enderecoIp deve ser um IP válido quando dentroRede é true'});
        }
    }),
    dentroRede: Joi.boolean().required(),


    dataRetirada: Joi.alternatives().conditional('status', {
        is: 'Inativo',
        then: Joi.date().iso().required(),
        otherwise: Joi.forbidden()
    }),
    contadorRetirada: Joi.alternatives().conditional('status', {
        is: 'Inativo',
        then: Joi.number().integer().required(),
        otherwise: Joi.forbidden()
    }),
    status: Joi.string().required(),

    dataInstalacao: Joi.date().iso().required(),
    marca: Joi.string().required(),
    modelo: Joi.string().required(),
    contadorInstalacao: Joi.number().integer().required(),
    cidade: Joi.string().required(),
    regional: Joi.string().required(),
    subestacao: Joi.string().optional(),
});
