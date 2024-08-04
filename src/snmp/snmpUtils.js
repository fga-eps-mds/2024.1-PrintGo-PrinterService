const snmp = require('snmp-native');

const getSnmpData = (host, port, oids) => {
    return new Promise((resolve, reject) => {
        const session = new snmp.Session({ host: host, port: port, community: 'public' });

        const result = {};

        session.getAll({ oids: oids }, function (error, varbinds) {
            if (error) {
                reject(error);
                session.close()
                return;
            } else {
                varbinds.forEach(function (vb) {
                    result[vb.oid] = vb.value;
                });
                resolve(result)
            }
            session.close();
        });
    });
};

module.exports = { getSnmpData };
