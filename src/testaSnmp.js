const { getSnmpData } = require('./snmp/snmpUtils');

const oids = [
    '.1.3.6.1.4.1.11.2.3.9.4.2.1.3.7.2.13.0',
    '.1.3.6.1.4.1.11.2.3.9.4.2.1.1.6.5.14.0',
    '.1.3.6.1.4.1.11.2.3.9.4.2.1.1.6.5.22.0'
];

const host = '172.24.192.1';
const port = 161;

const fetchSnmpData = async () => {
    try {
        const snmpData = await getSnmpData(host, port, oids);
        console.log('SNMP Data:', snmpData);
    } catch (error) {
        console.error('Erro ao buscar dados SNMP:', error);
    }
};

fetchSnmpData();
