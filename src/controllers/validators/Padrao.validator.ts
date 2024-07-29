import Joi from 'joi';

export const createPadraoValidator = Joi.object({
    modelo: Joi.string().required(),
    marca: Joi.string().required(),
    tipo: Joi.string().required(),
    colorido: Joi.bool().required(),
    oidModelo: Joi.string().allow(null).optional(),
    oidNumeroSerie: Joi.string().allow(null).optional(),
    oidFirmware:  Joi.string().allow(null).optional(),
    oidTempoAtivo:  Joi.string().allow(null).optional(),
    oidDigitalizacoes:  Joi.string().allow(null).optional(),
    oidCopiasPB:  Joi.string().allow(null).optional(),
    oidCopiasCor: Joi.string().allow(null).optional(),
    oidTotalGeral:  Joi.string().allow(null).optional()
});
