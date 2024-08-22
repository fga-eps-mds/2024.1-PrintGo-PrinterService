// import { PrismaClient } from "@prisma/client";
// import { RelatorioLocadora } from '../types/RelatorioLocadora.type'
//
// const locadoraClient = new PrismaClient().relatorioLocadora;
//
// export const createLocadoraReport = async (relatorio: RelatorioLocadora): Promise<RelatorioLocadora | false> => {
//     const {
//         impressoraId,
//         contadorPB,
//         contadorCor,
//         contadorTotal,
//     } = relatorio;
//
//     try {
//         // Cria um novo relatorio e associa a impressora
//         const newReport = await locadoraClient.create({
//             data: {
//                 impressoraId,
//                 contadorPB,
//                 contadorCor,
//                 contadorTotal,
//             },
//         });
//
//         return newReport;
//     }
//     catch (error) {
//         console.error("Erro ao criar impressora:", error);
//         return false;
//     }
// };
