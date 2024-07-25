import Joi from 'joi';

export const createImpressoraValidator = Joi.object({
    contrato: Joi.string().required(),
    numSerie: Joi.string().required(),

    enderecoIp: Joi.string().custom((value, helpers) => {
        const { dentroRede } = helpers.state.ancestors[0];

        // Se dentroRede é false e enderecoIp não é '0.0.0.0', define o valor como '0.0.0.0'
        if (dentroRede === false && value !== '0.0.0.0') {
            return '0.0.0.0';
        }

        // Se dentroRede é true, valida o enderecoIp
        if (dentroRede === true && !Joi.string().ip().validate(value).error) {
            return value; // Retorna o valor validado se for um IP válido
        }

        // Se dentroRede é true e enderecoIp não é válido, retorna um erro de validação
        // if (dentroRede === true && Joi.string().ip().validate(value).error) {
        //     return helpers.message('enderecoIp deve ser um IP válido quando dentroRede é true');
        // }

        // Caso contrário, retorna o valor como está
        return value;
    }),
    dentroRede: Joi.boolean().required(),


    dataRetirada: Joi.date().iso()
        .when('status', {
            is: 'ativo',
            then: Joi.required(), // Torna a dataRetirada obrigatória quando status é ativo
            otherwise: Joi.forbidden() // Não requer dataRetirada quando status não é ativo
        }),
    status: Joi.string().required(),

    dataInstalacao: Joi.date().iso().required(),
    marca: Joi.string().required(),
    modelo: Joi.string().required(),
    contadorInstalacao: Joi.number().integer().required(),
    contadorRetirada: Joi.number().integer().required(),
    cidade: Joi.string().required(),
    regional: Joi.string().required(),
    subestacao: Joi.string().required(),
});
