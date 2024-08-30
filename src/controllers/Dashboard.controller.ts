import { request, Request, response, Response } from "express";
import {
    getFiltroOpcoes,
    getDashboardData
} from "../repository/dashboard.repository";
import { getColorPrinterModelIds, getPbPrinterModelIds } from "../repository/Padrao.repository";
import { createReport } from "../usecases/report/generate.dashboardPdf"; // Import the service that generates the PDF

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
    },

    async createReport(req: Request, res: Response): Promise<Response> { // Garanta que o retorno seja do tipo Response
        try {
            const reportBuffer = await createReport(req.body);
            res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
            res.setHeader('Content-Type', 'application/pdf');
            return res.send(reportBuffer); // Retorne a resposta
        } catch (error) {
            return res.status(500).send('Erro ao gerar o relatório'); // Retorne a resposta em caso de erro
        }
    },
}
