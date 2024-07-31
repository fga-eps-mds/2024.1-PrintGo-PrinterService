import { Request, Response } from 'express';
import { listImpressorasRelatorio } from '../repository/Impressora.repository'
import { findById } from '../repository/Report.repository'

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
            const result = await findById(numberID);
            if (!result){ 
                return response.status(404).json({error: "Padrão não encontrado"});
            }                   
            return response.status(200).json(result);
        }
        catch(error){
            return response.status(500).send();
        }
    },

    async retrieveMonthReport(request: Request, response: Response) {
        try {
            const numberID = parseInt(request.params.id as string)
            const result = await findById(numberID);
            if (!result){ 
                return response.status(404).json({error: "Padrão não encontrado"});
            }                   
            return response.status(200).json(result);
        }
        catch(error){
            return response.status(500).send();
        }
    },



};
