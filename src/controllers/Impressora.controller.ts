import { Request, Response } from 'express';
import { createImpressora, findImpressora, findImpressoraByNumSerie, listImpressoras, deleteImpressora, updateImpressora, listImpressorasRelatorio, addContadores } from '../repository/Impressora.repository'
import { addcontadorValidator, createImpressoraValidator as createValidator, updateImpressoraValidator as updateValidator } from './validator/Impressora.validator';

export default {
    async createImpressora(request: Request, response: Response) {
        const { error, value } = createValidator.validate(request.body);
        if (error) {
            return response.status(400).json({ error: error.details });
        }

        try {
            const impressora = value;

            let result = await findImpressoraByNumSerie(impressora.numSerie);
            if (result) {
                return response.status(409).json({
                    message: 'Erro: Impressora já existe.',
                });
            }

            result = await createImpressora(impressora);
            if (!result) {
                return response.status(500).json({
                    message: 'Erro: Não foi possível criar uma impressora.',
                });
            }

            return response.status(201).json({
                message: 'Sucesso: Impressora cadastrada com sucesso!',
                data: result
            });

        } catch (error) {
            return response.json({ error: true, message: error.message });
        }
    },

    async listImpressoras(request: Request, response: Response) {
        try {
            let result = await listImpressoras();
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


    async updateImpressora(request: Request, response: Response) {
        const { error, value } = updateValidator.validate(request.body);
        if (error) {
            return response.status(400).json({ error: error.details });
        }

        const { id } = request.params;

        try {
            const idNumber = parseInt(id, 10);
            if (isNaN(idNumber)) {
                return response.status(400).json({
                    message: 'Erro: ID inválido.',
                });
            }

            const result = await updateImpressora(idNumber, value);

            if (!result) {
                return response.status(404).json({
                    message: 'Erro: Impressora não encontrada.',
                });
            }

            return response.status(200).json({
                message: 'Sucesso: Impressora atualizada com sucesso!',
                data: result
            });

        } catch (error) {
            return response.status(500).json({
                error: true,
                message: error.message,
            });
        }
    },

    async deleteImpressora(request: Request, response: Response) {
        const { id } = request.params;

        // Validate ID as a number
        const idNumber = parseInt(id, 10);
        if (isNaN(idNumber)) {
            return response.status(400).json({
                message: 'Erro: ID inválido.',
            });
        }

        try {
            // Check if the impressora exists
            const exists = await findImpressora(idNumber);
            if (!exists) {
                return response.status(404).json({
                    message: 'Erro: Impressora não encontrada.',
                });
            }

            // Attempt to soft delete the impressora
            const result = await deleteImpressora(idNumber);
            if (!result) {
                return response.status(500).json({
                    message: 'Erro: Não foi possível desativar a impressora.',
                });
            }

            return response.status(200).json({
                message: 'Sucesso: Impressora desativada com sucesso!',
            });

        } catch (error) {
            return response.status(500).json({
                error: true,
                message: error.message,
            });
        }
    },

    async getImpressora(request: Request, response: Response) {
        const { id } = request.params;

        const idNumber = parseInt(id, 10);
        if (isNaN(idNumber)) {
            return response.status(400).json({
                message: 'Erro: ID inválido.',
            });
        }

        try {
            const impressora = await findImpressora(idNumber);
            if (!impressora) {
                return response.status(404).json({
                    message: 'Erro: Impressora não encontrada.',
                });
            }

            return response.status(200).json(impressora);

        } catch (error) {
            return response.status(500).json({
                error: true,
                message: error.message,
            });
        }
    },

    async addContadores(request: Request, response: Response) {
        const { error, value } = addcontadorValidator.validate(request.body);
        

        if (error) {
            return response.status(400).json({ error: error.details });
        }
        

        try {
            const { numSerie } = value;

            const result = await addContadores(numSerie, value);

            if (!result) {
                return response.status(404).json({
                    message: 'Erro: Impressora não encontrada.',
                });
            }

            return response.status(200).json({
                message: 'Sucesso: Contadores atualizados com sucesso!',
                data: result
            });

        } catch (error) {
            return response.status(500).json({
                error: true,
                message: error.message,
            });
        }
    },

};    