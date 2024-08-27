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
    }
}
