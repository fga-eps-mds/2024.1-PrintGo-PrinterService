import { Request, Response } from 'express';
import { createRotina, deleteRotina, getRotinaById, listRotinas, updateRotina } from '../repository/RotinaSnmp.repository';
import { rotinaSnmpValidator } from './validator/RotinaSnmp.validator';
import { startCronJob, stopCronJob } from '../snmp/cronJobs';

export default {
    async createRotina(request: Request, response: Response) {
        const { error, value } = rotinaSnmpValidator.validate(request.body);
        if (error) {
            return response.status(400).json({ error: error.message });
        }

        try {
            const rotinaBody = value;
            const newRotina = await createRotina(rotinaBody);
            if (!newRotina) {
                return response.status(400).send();
            }
            startCronJob(newRotina);
            return response.status(201).json(newRotina);
        } catch (error) {
            return response.status(500).send();
        }
    },

    async getRotina(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const rotina = await getRotinaById(parseInt(id));
            if (rotina) {
                return response.status(200).json(rotina);
            } else {
                return response.status(404).send('Rotina SNMP não encontrada');
            }
        } catch (error) {
            return response.status(500).send();
        }
    },

    async listRotinas(request: Request, response: Response) {
        try {
            const rotinas = await listRotinas();
            return response.status(200).json(rotinas);
        } catch (error) {
            return response.status(500).send();
        }
    },

    async updateRotina(request: Request, response: Response) {
        const { id } = request.params;
        const { error, value } = rotinaSnmpValidator.validate(request.body);
        if (error) {
            return response.status(400).json({ error: error.message });
        }

        try {
            const updatedRotina = await updateRotina(parseInt(id), value);
            if (updatedRotina) {
                return response.status(200).json(updatedRotina);
            } else {
                return response.status(404).send('Rotina SNMP não encontrada');
            }
        } catch (error) {
            return response.status(500).send();
        }
    },

    async deleteRotina(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const success = await deleteRotina(parseInt(id));
            if (success) {
                stopCronJob(parseInt(id));
                return response.status(204).send();
            } else {
                return response.status(404).send('Rotina SNMP não encontrada');
            }
        } catch (error) {
            return response.status(500).send();
        }
    }
};
