import { CronJob } from 'cron';
import { listImpressorasRelatorio } from '../../repository/Impressora.repository'
import { updateReport } from './update.report';
import { Impressora } from '../../types/Impressora.type';

export const reportSchedule = new CronJob(
    // Roda todos os dias às 00:00
    '0 0 0 * * *',
    async function() {
        console.log('Iniciando a atualização dos relatórios');
        const impressoras: Impressora[] | false = await listImpressorasRelatorio();
        if (!impressoras) {
            console.error('Erro ao listar impressoras');
            return
        }

        impressoras.forEach(async impressora => {
            await updateReport(impressora)
        });
    },
    null,
    true,
    'America/Sao_Paulo' 
);
