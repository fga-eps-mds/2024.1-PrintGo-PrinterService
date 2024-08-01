import { PrismaClient, Relatorio } from '@prisma/client';

const prisma = new PrismaClient();

export const updateReport = async (): Promise<void> => {
    try {
        const latestReport: Relatorio | null = await prisma.relatorio.findFirst({
            orderBy: { ultimaAtualizacao: 'desc' }
        });

        const currentCounter = await getCurrentCounter(latestReport ? latestReport.impressoraId : 1);

        let shouldCreateNewReport = false;
        let newReportData: Omit<Relatorio, 'id'>;

        if (latestReport) {
            // Verifica se passou um mês desde a última atualização
            const lastUpdateDate = new Date(latestReport.ultimaAtualizacao);
            const today = new Date();
            const monthsPassed = isMonthPassed(lastUpdateDate, today);
            
            shouldCreateNewReport = monthsPassed;
        } else {
            // Se não houver relatório anterior, considere criar um novo relatório
            shouldCreateNewReport = true;
        }

        if (shouldCreateNewReport) {
            newReportData = {
                impressoraId: latestReport ? latestReport.impressoraId : 1,
                contadorMes: currentCounter,
                ultimoResultado: currentCounter,
                ultimaAtualizacao: new Date()
            };

            // Salva o novo relatório
            await prisma.relatorio.create({ data: newReportData });

            console.log('Relatório atualizado com sucesso:', newReportData);
        } else {
            console.log('Ainda não se passou um mês desde o último relatório. Nenhuma atualização de relatório necessária.');
        }
    } catch (error) {
        console.error('Erro ao atualizar o relatório:', error);
    } finally {
        await prisma.$disconnect();
    }
};

const getCurrentCounter = async (impressoraId: number): Promise<number> => {
    const impressora = await prisma.impressora.findUnique({
        where: { id: impressoraId },
        select: { contadorAtualPB: true, contadorAtualCor: true }
    });

    if (!impressora) {
        throw new Error(`Impressora com ID ${impressoraId} não encontrada`);
    }

    const latestReport = await prisma.relatorio.findFirst({
        where: { impressoraId },
        orderBy: { ultimaAtualizacao: 'desc' }
    });

    const previousCounter = latestReport ? latestReport.ultimoResultado : 0;
    return (impressora.contadorAtualPB + impressora.contadorAtualCor) - previousCounter;
};

const isMonthPassed = (lastUpdateDate: Date, currentDate: Date): boolean => {
    const lastUpdateMonth = lastUpdateDate.getFullYear() * 12 + lastUpdateDate.getMonth();
    const currentMonth = currentDate.getFullYear() * 12 + currentDate.getMonth();
    return (currentMonth - lastUpdateMonth) >= 1;
};
