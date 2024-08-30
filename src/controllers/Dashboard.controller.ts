import { request, Request, response, Response } from "express";
import {
    getFiltroOpcoes,
    getDashboardData
} from "../repository/dashboard.repository";
import { getColorPrinterModelIds, getPbPrinterModelIds } from "../repository/Padrao.repository";

export default {

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
    async getDashboardData(request: Request, response: Response) {
        try {
            const dashboardData = await getDashboardData();
            const colorModelIds = await getColorPrinterModelIds();
            const pbModelIds = await getPbPrinterModelIds();
    
            return response.status(200).json({
                ...dashboardData,
                colorModelIds,
                pbModelIds
            });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao buscar os dados do dashboard.",
            });
        }
    }
}
