import { Request, Response } from "express";
import {
  createImpressora,
  findImpressora,
  findImpressoraByNumSerie,
  listImpressoras,
  deleteImpressora,
  updateImpressora,
  listImpressorasRelatorio,
  updateContadores,
} from "../repository/Impressora.repository";
import { prisma } from "../database";

export default {
    async getTotalImpressions(request: Request, response: Response) {
        try {
            const totalImpressions = await prisma.impressora.aggregate({
                _sum: {
                    contadorAtualPB: true,
                    contadorAtualCor: true
                }
            });
    
            return response.status(200).json({
                totalImpressions: totalImpressions._sum.contadorAtualPB + totalImpressions._sum.contadorAtualCor
            });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao calcular impressões totais.",
            });
        }
    },

    async getColorPrintersCount(request: Request, response: Response) {
        try {
            const colorPrintersCount = await prisma.impressora.count({
                where: {
                    modeloId: {
                        in: await prisma.padrao.findMany({
                            where: {
                                colorido: true,
                            },
                            select: {
                                modelo: true
                            }
                        }).then(result => result.map(padrao => padrao.modelo))
                    }
                }
            });
    
            return response.status(200).json({
                colorPrintersCount
            });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao calcular o número de impressoras coloridas.",
            });
        }
    },

    async getPbPrintersCount(request: Request, response: Response) {
        try {
            const PbPrintersCount = await prisma.impressora.count({
                where: {
                    modeloId: {
                        in: await prisma.padrao.findMany({
                            where: {
                                colorido: false,
                            },
                            select: {
                                modelo: true
                            }
                        }).then(result => result.map(padrao => padrao.modelo))
                    }
                }
            });
    
            return response.status(200).json({
                PbPrintersCount
            });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao calcular o número de impressoras pretas e brancas.",
            });
        }
    },

    async getSumOfCountersByLocation(request: Request, response: Response) {
        try {
            const countersByLocation = await prisma.impressora.groupBy({
                by: ['localizacao'],
                _sum: {
                    contadorAtualPB: true,
                    contadorAtualCor: true
                }
            });
    
            const result = countersByLocation.map(location => ({
                localizacao: location.localizacao,
                totalPB: location._sum.contadorAtualPB??  0,
                totalCor: location._sum.contadorAtualCor??  0,
            }));
    
            return response.status(200).json({
                data: result
            });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao calcular a soma dos contadores por localização.",
            });
        }
    },

    async getEquipmentCountByLocation(request: Request, response: Response) {
        try {
            const equipmentCountByLocation = await prisma.impressora.groupBy({
                by: ['localizacao'],
                _count: {
                    id: true
                }
            });
    
            const result = equipmentCountByLocation.map(location => ({
                localizacao: location.localizacao,
                totalEquipamentos: location._count.id
            }));
    
            return response.status(200).json({
                data: result
            });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Erro ao contar o número de equipamentos por localização.",
            });
        }
    }
    
    
    
    }
    
    

