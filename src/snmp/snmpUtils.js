const snmp = require('snmp-native');

const getSnmpData = async (host, port, oids) => {
    return new Promise((resolve, reject) => {
        const session = new snmp.Session({ host: host, port: port, community: 'public' });

        const oids_formatted = oids.map((oid) => {
            if (oid[0] != '.')
                return '.' + oid;
            else
                return oid;
        });

        const result = {};

        session.getAll({ oids: oids_formatted }, function (error, varbinds) {
            if (error) {
                reject(error);
                session.close()
                return;
            } else {
                varbinds.forEach(function (vb) {
                    result[vb.oid.join('.')] = vb.value;
                });
                resolve(result);
            }
            session.close();
        });
    });
};

module.exports = { getSnmpData };
