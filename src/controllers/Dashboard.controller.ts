import { Request, Response } from "express";
import {
    getTotalImpressions,
    getSumOfCountersByLocation,
    getEquipmentCountByLocation,
    countColorPrinters,
    countPbPrinters,
    getSumOfCountersByImpressionType
} from "../repository/dashboard.repository";
import { getColorPrinterModelIds, getPbPrinterModelIds } from "../repository/Padrao.repository";

export default {
    async getTotalImpressions(request: Request, response: Response) {
        try {
            const result = await getTotalImpressions();
            return response.status(200).json(result);
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao calcular impressões totais.",
            });
        }
    },

    async getColorPrintersCount(request: Request, response: Response) {
        try {
            const colorModelIds = await getColorPrinterModelIds();
            if (!colorModelIds.length) {
                return response.status(200).json({ colorPrintersCount: 0 });
            }
            const colorPrintersCount = await countColorPrinters(colorModelIds);
            return response.status(200).json({ colorPrintersCount });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao calcular o número de impressoras coloridas.",
            });
        }
    },

    async getPbPrintersCount(request: Request, response: Response) {
        try {
            const pbModelIds = await getPbPrinterModelIds();
            if (!pbModelIds.length) {
                return response.status(200).json({ PbPrintersCount: 0 });
            }
            const PbPrintersCount = await countPbPrinters(pbModelIds);
            return response.status(200).json({ PbPrintersCount });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao calcular o número de impressoras preto e branco.",
            });
        }
    },

    async getSumOfCountersByLocation(request: Request, response: Response) {
        try {
            const result = await getSumOfCountersByLocation();
            return response.status(200).json({ data: result });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao calcular a soma dos contadores por localização.",
            });
        }
    },

    async getEquipmentCountByLocation(request: Request, response: Response) {
        try {
            const result = await getEquipmentCountByLocation();
            return response.status(200).json({ data: result });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao contar o número de equipamentos por localização.",
            });
        }
    },

    async getSumOfCountersByImpressionType(request: Request, response: Response) {
        try {
            const result = await getSumOfCountersByImpressionType();
            return response.status(200).json(result);
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao calcular a soma total dos contadores.",
            }); 
        }
    },
}