import snmp from 'net-snmp';
import { RotinaSnmp } from '../types/RotinaSnmp.type';
import { listImpressorasLocalizacao, updateImpressora } from '../repository/Impressora.repository';
import { getById as getPadrao } from '../repository/Padrao.repository';

export const coletaSnmpRotina = async (rotina: RotinaSnmp) => {
    const impressoras = await listImpressorasLocalizacao(rotina.localizacao);
    if (!impressoras) {
        console.log("Falha na listagem de impressoras");
        return;
    }

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
        const snmpData = await getSnmpData(host, oidsArray);

        const counts = {
            contadorAtualPB: parseInt(snmpData[oids.oidCopiasPB] || '0', 10),
            contadorAtualCor: parseInt(snmpData[oids.oidCopiasCor] || '0', 10)
        };
        await updateImpressora(impressora.id, counts);
    }
}

const getSnmpData = async (host, oids) => {
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
                        session.close;
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