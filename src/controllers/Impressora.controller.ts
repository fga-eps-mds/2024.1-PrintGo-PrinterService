import { Request, Response } from 'express';
import { Impressora, Status } from '../types/Impressora.type'
import { createImpressora, findImpressora, listImpressoras } from '../repository/Impressora.repository'
import { createImpressoraValidator as createValidator } from './validator/Impressora.validator';

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
    //
    // async editImpressora(request: Request, response: Response) {
    //     try {
    //         const { id } = request.params;
    //         const impressoraToChange = request.body as ImpressoraUpdateInput;
    //
    //         const impressoraExist = await prisma.impressora.findUnique({ where: { id: String(id) } });
    //
    //         if (!impressoraExist) {
    //             return response.status(404).json({
    //                 error: true,
    //                 message: 'Erro: Impressora não encontrada!',
    //             });
    //         }
    //
    //         const padraoExist = await prisma.padrao.findUnique({ where: { id: impressoraToChange.padrao_id } });
    //         if (!padraoExist) {
    //             return response.status(404).json({
    //                 error: true,
    //                 message: 'Erro: Padrao não encontrado!'
    //             });
    //         }
    //
    //         const updatedImpressora = await prisma.impressora.update({
    //             where: {
    //                 id: String(id)
    //             },
    //             data: impressoraToChange
    //         });
    //
    //         return response.status(200).json({
    //             message: 'Sucesso: Impressora atualizada com sucesso!',
    //             data: updatedImpressora
    //         });
    //
    //     } catch (error) {
    //         return response.json({ error: true, message: error.message });
    //     }
    // },
    //
    // async toggleImpressora(request: Request, response: Response) {
    //     try {
    //         const { id, status } = request.body;
    //
    //         const toggleStatus = status === 'ATIVO' ? 'DESATIVADO' : 'ATIVO';
    //
    //         const impressoraExist = await prisma.impressora.findUnique({ where: { id } });
    //
    //         if (!impressoraExist) {
    //             return response.status(404).json({
    //                 error: true,
    //                 message: 'Erro: Impressora não encontrada!',
    //             });
    //         }
    //
    //         const toggleImpre = await prisma.impressora.update({
    //             where: { id },
    //             data: { status: toggleStatus },
    //         });
    //
    //         return response.status(200).json({
    //             message: 'Sucesso: Impressora atualizada com sucesso!',
    //             data: toggleImpre,
    //         });
    //
    //     } catch (error) {
    //         return response.status(500).json({ error: true, message: error.message });
    //     }
    // },
    //
    // async deleteImpressoraById(request: Request, response: Response) {
    //     const { id } = request.params;
    //
    //     try {
    //
    //         const printerExists = await prisma.impressora.findUnique({ where: { id } });
    //
    //         if (!printerExists) {
    //             return response.status(404).json({
    //                 error: true,
    //                 message: 'Erro: Não foi possível encontrar a impressora.',
    //             });
    //         }
    //
    //         return response.status(200).json({
    //             message: "Sucesso: impressora deletada com sucesso.",
    //             data: await prisma.impressora.delete({
    //                 where: { id },
    //             }),
    //         });
    //
    //     } catch (error) {
    //         response.status(500).json({
    //             error: true,
    //             message: 'Erro: Ocorreu um erro ao apagar a impressora.'
    //         });
    //     }
    // },
};
