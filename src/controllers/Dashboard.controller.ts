import { Request, Response } from "express";
import {
    getTotalImpressions,
    getEquipmentCountByLocation,
    countColorPrinters,
    countPbPrinters,
    getSumOfCountersByImpressionType,
    getFiltroOpcoes,
    getAllPrintersData
} from "../repository/dashboard.repository";
import { getColorPrinterModelIds, getPbPrinterModelIds } from "../repository/Padrao.repository";

export default {
    async getTotalImpressions(request: Request, response: Response) {
        const cidade = request.query.cidade as string;
        const regional = request.query.regional as string;
        const unidade = request.query.unidade as string;
        const periodo = request.query.periodo as string; 

        try {
            const result = await getTotalImpressions({ cidade, regional, unidade, periodo });
            return response.status(200).json(result);
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao calcular impressões totais.",
            });
        }
    },

    async getColorPrintersCount(request: Request, response: Response) {
        const cidade = request.query.cidade as string;
        const regional = request.query.regional as string;
        const unidade = request.query.unidade as string;
        const periodo = request.query.periodo as string;
    
        try {
            const colorModelIds = await getColorPrinterModelIds();
            if (!colorModelIds.length) {
                return response.status(200).json({ colorPrintersCount: 0 });
            }
            const colorPrintersCount = await countColorPrinters({ colorModelIds, cidade, regional, unidade, periodo });
            return response.status(200).json({ colorPrintersCount });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao calcular o número de impressoras coloridas.",
            });
        }
    },
    

    async getPbPrintersCount(request: Request, response: Response) {
        const cidade = request.query.cidade as string;
        const regional = request.query.regional as string;
        const unidade = request.query.unidade as string;
        const periodo = request.query.periodo as string;
    
        try {
            const pbModelIds = await getPbPrinterModelIds();
            if (!pbModelIds.length) {
                return response.status(200).json({ PbPrintersCount: 0 });
            }
            const PbPrintersCount = await countPbPrinters({ pbModelIds, cidade, regional, unidade, periodo });
            return response.status(200).json({ PbPrintersCount });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao calcular o número de impressoras preto e branco.",
            });
        }
    },
    

    async getAllPrintersData(request: Request, response: Response) {
        try {
            const result = await getAllPrintersData();
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

    async getFiltroOpcoes(request: Request, response: Response) {
        try {
            const opcoes = await getFiltroOpcoes();
            return response.status(200).json(opcoes);
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao buscar opções de filtro.",
            });
        }
    },
}
