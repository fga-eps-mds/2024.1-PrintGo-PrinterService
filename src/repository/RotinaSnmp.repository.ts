import { PrismaClient } from '@prisma/client';
import { RotinaSnmp } from '../types/RotinaSnmp.type';

const rotinaSnmpClient = new PrismaClient().rotinaSnmp;

export const createRotina = async (rotina: RotinaSnmp): Promise<RotinaSnmp | false> => {
    try {
        const newRotina = await rotinaSnmpClient.create({ data: rotina });
        return newRotina;
    } catch (error) {
        console.error("Erro ao criar rotina SNMP", error);
        return false;
    }
}

export const getRotinaById = async (id: number): Promise<RotinaSnmp | null> => {
    try {
        const rotina = await rotinaSnmpClient.findUnique({ where: { id } });
        return rotina;
    } catch (error) {
        console.error("Erro ao buscar rotina SNMP pelo ID", error);
        return null;
    }
}

export const listRotinas = async (): Promise<RotinaSnmp[]> => {
    try {
        const rotinas = await rotinaSnmpClient.findMany();
        return rotinas;
    } catch (error) {
        console.error("Erro ao listar rotinas SNMP", error);
        return [];
    }
}

export const listRotinasAtivas = async (): Promise<RotinaSnmp[]> => {
    try {
        const rotinas = await rotinaSnmpClient.findMany({
            where: {
                ativo: true
            }
        });
        return rotinas;
    } catch (error) {
        console.error("Erro ao listar rotinas SNMP", error);
        return [];
    }
}

export const updateRotina = async (id: number, rotina: Partial<RotinaSnmp>): Promise<RotinaSnmp | false> => {
    try {
        const updatedRotina = await rotinaSnmpClient.update({
            where: { id },
            data: rotina
        });
        return updatedRotina;
    } catch (error) {
        console.error("Erro ao atualizar rotina SNMP", error);
        return false;
    }
}

export const deleteRotina = async (id: number): Promise<boolean> => {
    try {
        await rotinaSnmpClient.delete({ where: { id } });
        return true;
    } catch (error) {
        console.error("Erro ao deletar rotina SNMP", error);
        return false;
    }
}
