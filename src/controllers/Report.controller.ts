import { Request, Response } from 'express';
import { listImpressorasRelatorio, findImpressoraWithReport } from '../repository/Impressora.repository'
import { generateReport, generateMonthReport, createPdf } from '../usecases/report/generate.report'
import { Impressora } from '../types/Impressora.type'
import fs from 'fs';
import { updateReport } from '../usecases/report/update.report';

export default {

    async listImpressorasReports(request: Request, response: Response) {
        try {
            let result = await listImpressorasRelatorio();
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
            await updateReport(result);

            const resultTest: Impressora | false = await findImpressoraWithReport(numberID);
            if (!resultTest) {
                return response.status(404).json({ error: "Relatório não encontrado" });
            }
            const filePath: string | false = await createPdf(generateMonthReport(resultTest));
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

const sendFile = (response: Response, filePath: string, numSerie: string): Promise<Response> => {
    return new Promise<Response>((resolve, reject) => {
        response.download(filePath, `relatorio_${numSerie}.pdf`, (err) => {
            if (err) {
                console.error('Erro ao enviar o arquivo:', err);
                reject(response.status(500).json({ error: "Erro ao enviar o relatório" }));
            } else {
                fs.unlink(filePath, (unlinkErr: any) => {
                    if (unlinkErr) {
                        console.error('Erro ao deletar o arquivo:', unlinkErr);
                    } else {
                        console.log('Arquivo deletado com sucesso:', filePath);
                    }
                });
                resolve(response);
            }
        });
    });
}

