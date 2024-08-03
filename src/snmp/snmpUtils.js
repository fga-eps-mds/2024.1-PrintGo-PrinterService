const snmp = require('snmp-native');

const oidStringToArray = (oidString) => {
    return oidString.split('.').map(Number).filter(num => !isNaN(num));
};

const getSnmpData = (host, port, oids) => {
    return new Promise((resolve, reject) => {
        const session = new snmp.Session({ host: host, port: port, community: 'public' });

        const oidsArray = oids.map(oidString => oidString.startsWith('.') ? oidString.slice(1) : oidString);
        const oidsArrayFormatted = oidsArray.map(oidString => oidStringToArray(oidString));

        const results = {};

        let pendingRequests = oidsArrayFormatted.length;

        oidsArrayFormatted.forEach(oid => {            
            session.get({ oid: oid }, (error, varbinds) => {
                if (error) {
                    reject(error);
                    session.close();
                    return;
                }

                varbinds.forEach(vb => {
                    results[vb.oid.join('.')] = vb.value.toString();
                });

                pendingRequests -= 1;
                if (pendingRequests === 0) {
                    session.close();
                    resolve(results);
                }
            });
        });
    });
};

module.exports = { getSnmpData };
