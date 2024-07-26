import { Request, Response } from 'express';
import { Impressora, Status } from '../types/Impressora.type'
import { createImpressora, findImpressora, listImpressoras, deleteImpressora, updateImpressora } from '../repository/Impressora.repository'
import { createImpressoraValidator as createValidator, updateImpressoraValidator as updateValidator } from './validator/Impressora.validator';

export default {
    async createImpressora(request: Request, response: Response) {
        const { error, value } = createValidator.validate(request.body);
        if (error) {
            return response.status(400).json({ error: error.details });
        }

        try {
            const { status, ...rest } = value as any;
            const uppercaseStatus: Status = status.toUpperCase() as Status;
            if (!Object.values(Status).includes(uppercaseStatus)) {
                return response.status(400).json({ error: 'Status inválido.' });
            }

            const impressora: Impressora = {
                ...rest,
                status: uppercaseStatus
            }

            let result = await findImpressora(impressora.numSerie)
            if (result) {
                return response.status(409).json({
                    message: 'Erro: Impressora já existe.',
                });
            }

            result = await createImpressora(impressora)
            if (!result) {
                return response.status(500).json({
                    message: 'Erro: Não foi possível criar uma impressora.',
                });
            }

            return response.status(201).json({
                message: 'Sucesso: Impressora cadastrada com sucesso!',
                data: impressora
            });

        } catch (error) {
            return response.json({ error: true, message: error.message });
        }
    },

    async listImpressoras(request: Request, response: Response) {
        try {
            let result = await listImpressoras()
            if (!result) {
                return response.status(500).json({
                    message: 'Erro: Não foi possível listar impressoras.',
                });
            }

            return response.status(201).json({
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
    async updateImpressora(request: Request, response: Response) {
        const { numSerie } = request.params;
        const { error, value } = updateValidator.validate(request.body);

        if (error) {
            return response.status(400).json({ error: error.details });
        }

        try {
            const { status, ...rest } = value as any;
            const uppercaseStatus: Status = status.toUpperCase() as Status;

            if (!Object.values(Status).includes(uppercaseStatus)) {
                return response.status(400).json({ error: 'Status inválido.' });
            }

            const impressora: Impressora = {
                ...rest,
                status: uppercaseStatus,
            };

            let result = await findImpressora(numSerie);

            if (!result) {
                return response.status(404).json({
                    message: 'Erro: Impressora não encontrada.',
                });
            }

            result = await updateImpressora(numSerie, impressora);
            if (!result) {
                return response.status(500).json({
                    message: 'Erro: Não foi possível atualizar a impressora.',
                });
            }

            return response.status(200).json({
                message: 'Sucesso: Impressora atualizada com sucesso!',
                data: impressora,
            });

        } catch (error) {
            return response.status(500).json({
                error: true,
                message: error.message,
            });
        }
    },

    async deleteImpressora(request: Request, response: Response) {
        const { numSerie } = request.params;

        try {
            const exists = await findImpressora(numSerie);

            if (!exists) {
                return response.status(404).json({
                    message: 'Erro: Impressora não encontrada.',
                });
            }

            const result = await deleteImpressora(numSerie);
            if (!result) {
                return response.status(500).json({
                    message: 'Erro: Não foi possível atualizar o status da impressora.',
                });
            }

            return response.status(200).json({
                message: 'Sucesso: Impressora marcada como inativa com sucesso!',
            });

        } catch (error) {
            return response.status(500).json({
                error: true,
                message: error.message,
            });
        }
    },
};
