import Joi from 'joi';

export const createPadraoValidator = Joi.object({
    modelo: Joi.string().required(),
    marca: Joi.string().required(),
    tipo: Joi.string().required(),
    colorido: Joi.bool().required(),
    oidModelo: Joi.string().optional(),
    oidNumeroSerie: Joi.string().optional(),
    oidFirmware:  Joi.string().optional(),
    oidTempoAtivo:  Joi.string().optional(),
    oidDigitalizacoes:  Joi.string().optional(),
    oidCopiasPB:  Joi.string().optional(),
    oidCopiasCor: Joi.string().optional(),
    oidTotalGeral:  Joi.string().optional()
});
