import { Request, Response } from 'express';
import { createLocadoraReport as createLocadoraRep } from '../repository/Locadora.repository'

export default {
    async createLocadoraReport(request: Request, response: Response) {
        try {
            const locadora = request.body;

            const result = await createLocadoraRep(locadora);
            if (!result) {
                return response.status(500).json({
                    message: 'Erro: Não foi possível criar uma impressora.',
                });
            }

            return response.status(201).json({
                message: 'Sucesso: Relatorio de impressora cadastrada com sucesso!',
                data: result
            });

        } catch (error) {
            return response.json({ error: true, message: error.message });
        }
    },
};

