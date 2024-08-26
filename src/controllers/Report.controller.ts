import { Request, Response } from 'express';
import { listImpressorasContract, findImpressoraWithReport } from '../repository/Impressora.repository'
import { generateReport, generateMonthReport, createPdf } from '../usecases/report/generate.report'
import { Impressora } from '../types/Impressora.type'
import { sendFile } from '../utils/sendFile'

export default {

    async listImpressorasContractReports(request: Request, response: Response) {
        try {
            const contractId: string = request.params.contractId as string;
            const result: Partial<Impressora>[] | false = await listImpressorasContract(contractId);
            if (!result) {
                return response.status(500).json({
                    message: 'Erro: Não foi possível listar impressoras.',
                });
            }

            return response.status(200).json({
                message: 'Sucesso: Impressoras listadas com sucesso!',
                data: result
            });

        } catch (error) {
            return response.status(500).json({
                error: true,
                message: 'Erro: Ocorreu um erro ao listar as impressoras.'
            });
        }
    },

    async retrieveReport(request: Request, response: Response) {
        try {
            const numberID = parseInt(request.params.id as string)
            const result: Impressora | false = await findImpressoraWithReport(numberID);
            if (!result) {
                return response.status(404).json({ error: "Relatório não encontrado" });
            }

            const filePath: string | false = await createPdf(generateReport(result));
            if (!filePath) {
                return response.status(500).json({ error: "Erro ao gerar o relatório" });
            }

            return sendFile(response, filePath, result.numSerie);
        }
        catch (error) {
            return response.status(500).send();
        }
    },

    async retrieveMonthReport(request: Request, response: Response): Promise<Response> {
        try {
            const numberID = parseInt(request.params.id as string)
            const result: Impressora | false = await findImpressoraWithReport(numberID);
            if (!result) {
                return response.status(404).json({ error: "Relatório não encontrado" });
            }

            const filePath: string | false = await createPdf(generateMonthReport(result));
            if (!filePath) {
                return response.status(500).json({ error: "Erro ao gerar o relatório" });
            }

            return sendFile(response, filePath, result.numSerie);
        }
        catch (error) {
            console.error('Erro ao processar a requisição:', error);
            return response.status(500).send();
        }
    },



};

