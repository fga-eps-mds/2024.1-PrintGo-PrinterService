import Joi from 'joi';
import { isValidCron } from 'cron-validator';

export const rotinaSnmpValidator = Joi.object({
    id: Joi.number().integer(),
    localizacao: Joi.string().allow(null, ''),
    dataCriado: Joi.date(),
    dataUltimoUpdate: Joi.date().allow(null),
    cronExpression: Joi.string().required().custom((value, helpers) => {
        if (!isValidCron(value, { seconds: true }))
        {
            return helpers.message({custom: "Expressão cron inválida"})
        }
        return value;
    }),
    ativo: Joi.boolean().required(),
    cidadeTodas: Joi.boolean().allow(null),
    regionalTodas: Joi.boolean().allow(null),
    unidadeTodas: Joi.boolean().allow(null),
});

export const updateRotinaSnmpValidator = Joi.object({
    id: Joi.number().integer(),
    localizacao: Joi.string().allow(null, '').optional(),
    dataCriado: Joi.date().optional(),
    dataUltimoUpdate: Joi.date().allow(null).optional(),
    cronExpression: Joi.string().optional().custom((value, helpers) => {
        if (!isValidCron(value, { seconds: true }))
        {
            return helpers.message({custom: "Expressão cron inválida"})
        }
        return value;
    }),
    ativo: Joi.boolean().optional(),
    cidadeTodas: Joi.boolean().allow(null).optional(),
    regionalTodas: Joi.boolean().allow(null).optional(),
    unidadeTodas: Joi.boolean().allow(null).optional(),
});