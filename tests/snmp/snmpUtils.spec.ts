// getSnmpData.test.js
const { getSnmpData } = require('../../src/snmp/snmpUtils');
const snmp = require("net-snmp");

jest.mock('net-snmp', () => {
    return {
        createSession: jest.fn().mockReturnValue({
            get: jest.fn(),
            close: jest.fn(),
        }),
        isVarbindError: jest.fn(),
        varbindError: jest.fn()
    };
});

describe("getSnmpData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return SNMP data", async () => {
    const host = "localhost";
    const oids = ["1.3.6.1.2.1.1.1.0"];

    const mockVarbinds = [
      { oid: "1.3.6.1.2.1.1.1.0", value: "mockValue" },
    ];

    snmp.isVarbindError.mockReturnValue(false);
    snmp.createSession().get.mockImplementation((oids, callback) => {
      callback(null, mockVarbinds);
    });

    const result = await getSnmpData(host, oids);

    expect(snmp.createSession).toHaveBeenCalledWith(host, "public");
    expect(snmp.createSession().get).toHaveBeenCalledWith(oids, expect.any(Function));
    expect(result).toEqual({
      "1.3.6.1.2.1.1.1.0": "mockValue",
    });
  });

  it("should handle errors in SNMP get", async () => {
    const host = "localhost";
    const oids = ["1.3.6.1.2.1.1.1.0"];
    const mockError = new Error("SNMP get error");

    snmp.createSession().get.mockImplementation((oids, callback) => {
      callback(mockError, null);
    });

    await expect(getSnmpData(host, oids)).rejects.toThrow("SNMP get error");

    expect(snmp.createSession).toHaveBeenCalledWith(host, "public");
    expect(snmp.createSession().get).toHaveBeenCalledWith(oids, expect.any(Function));
  });

  it("should handle varbind errors", async () => {
    const host = "localhost";
    const oids = ["1.3.6.1.2.1.1.1.0"];
    const mockVarbinds = [
      { oid: "1.3.6.1.2.1.1.1.0", value: "mockValue" },
    ];

    snmp.isVarbindError.mockReturnValue(true);
    snmp.varbindError.mockReturnValue(new Error("Varbind error"));
    snmp.createSession().get.mockImplementation((oids, callback) => {
      callback(null, mockVarbinds);
    });

    await expect(getSnmpData(host, oids)).rejects.toThrow("Varbind error");

    expect(snmp.createSession).toHaveBeenCalledWith(host, "public");
    expect(snmp.createSession().get).toHaveBeenCalledWith(oids, expect.any(Function));
  });
});