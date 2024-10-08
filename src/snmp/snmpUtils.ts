import snmp from 'net-snmp';
import { RotinaSnmp } from '../types/RotinaSnmp.type';
import { listImpressorasLocalizacao, updateImpressora } from '../repository/Impressora.repository';
import { getById as getPadrao } from '../repository/Padrao.repository';
import { Impressora } from '../types/Impressora.type';
import { updateRotina } from '../repository/RotinaSnmp.repository';

export const coletaSnmpRotina = async (rotina: RotinaSnmp) => {
    const impressoras = await listImpressorasLocalizacao(rotina.localizacao, rotina.cidadeTodas, rotina.regionalTodas, rotina.unidadeTodas);
    if (impressoras === false) {
        console.log("Falha na listagem de impressoras");
        return;
    }
    if (impressoras.length == 0) {
        return;
    }

    await coletaSnmpAtualizaContadores(impressoras);
    const updateData: Partial<RotinaSnmp> = {dataUltimoUpdate: new Date()};
    await updateRotina(rotina.id, updateData);
}

const coletaSnmpAtualizaContadores = async (impressoras: Impressora[]) => {
    for (const impressora of impressoras) {
        const modeloId = parseInt(impressora.modeloId, 10);
        if (isNaN(modeloId)) {
            console.error(`ID de modelo inválido: ${impressora.modeloId}`);
            continue;
        }

        const padrao = await getPadrao(modeloId);
        if (!padrao) {
            console.error(`Padrão não encontrado para o modelo: ${modeloId}`);
            continue;
        }

        const oids = {
            oidModelo: padrao.oidModelo,
            oidNumeroSerie: padrao.oidNumeroSerie,
            oidFirmware: padrao.oidFirmware,
            oidTempoAtivo: padrao.oidTempoAtivo,
            oidDigitalizacoes: padrao.oidDigitalizacoes,
            oidCopiasPB: padrao.oidCopiasPB,
            oidCopiasCor: padrao.oidCopiasCor,
            oidTotalGeral: padrao.oidTotalGeral
        };

        const host = impressora.enderecoIp;
        const oidsArray = Object.values(oids).filter(oid => oid !== null);
        try {
            var snmpData = await getSnmpData(host, oidsArray);            
        }
        catch (error) {
            console.log(`Falha ao coletar dados SNMP da impressora ${impressora.id}. ${error}`);
            continue;
        }

        const counts = {
            contadorAtualPB: parseInt(snmpData[oids.oidCopiasPB] || '0', 10),
            contadorAtualCor: parseInt(snmpData[oids.oidCopiasCor] || '0', 10)
        };
        await updateImpressora(impressora.id, counts);
    }
}

export const getSnmpData = async (host, oids) => {
    return new Promise((resolve, reject) => {
        const community = "public";
        const session = snmp.createSession(host, community);

        const result = {};

        session.get(oids, function (error, varbinds) {
            if (error) {
                reject(error);
                session.close();
                return;
            } else {
                varbinds.forEach((vb) => {
                    if (snmp.isVarbindError(vb)) {
                        reject(snmp.varbindError(vb));
                        session.close();
                        return;
                    } else {
                        result[vb.oid] = vb.value.toString();
                    }
                });
                resolve(result);
                session.close();
            }
        });
    });
};