const snmp = require("net-snmp");

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

module.exports = { getSnmpData };
