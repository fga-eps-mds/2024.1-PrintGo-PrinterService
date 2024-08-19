const Joi = require('joi');

export const rotinaSnmpValidator = Joi.object({
  id: Joi.number().integer(),
  localizacao: Joi.string().allow(null, ''),
  dataCriado: Joi.date(),
  dataUltimoUpdate: Joi.date().allow(null),
  cronExpression: Joi.string().required(),
  ativo: Joi.boolean().required(),
  cidadeTodas: Joi.boolean().allow(null),
  regionalTodas: Joi.boolean().allow(null),
  unidadeTodas: Joi.boolean().allow(null),
});
