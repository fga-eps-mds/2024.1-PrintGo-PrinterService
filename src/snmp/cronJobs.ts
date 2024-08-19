import cron from 'node-cron';
import { RotinaSnmp } from '../types/RotinaSnmp.type';
import { coletaSnmpRotina } from './snmpUtils';
import { listRotinasAtivas } from '../repository/RotinaSnmp.repository';

const cronJobs: { [key: number]: cron.ScheduledTask } = {};

export async function startCronJob(rotina: RotinaSnmp) {
    if (cronJobs[rotina.id]) {
        cronJobs[rotina.id].stop();
    }

    cronJobs[rotina.id] = cron.schedule(rotina.cronExpression, async () => {
        console.log(`Rodando coleta para rotina ${rotina.id}`);
        await coletaSnmpRotina(rotina);
    });
}

export function stopCronJob(rotinaId: number): void {
    const job = cronJobs[rotinaId];

    if (job) {
        job.stop();
        delete cronJobs[rotinaId];
        console.log(`Rotina ${rotinaId} foi interrompida e removida.`);
    } else {
        console.log(`Rotina ${rotinaId} não existe.`);
    }
}

export async function carregaRotinasSnmp() {   // inicializa rotinas que estão no banco
    const rotinas = await listRotinasAtivas();
    rotinas.forEach((rotina) => startCronJob(rotina));
}
