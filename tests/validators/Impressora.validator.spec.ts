import {
  updateContadoresValidator,
  createImpressoraValidator,
  updateImpressoraValidator,
} from "../../src/controllers/validator/Impressora.validator";

describe("Impressora Validators", () => {
  describe("createImpressoraValidator", () => {
    it("should validate a valid printer creation payload", () => {
      const validData = {
        numContrato: "12345",
        numSerie: "ABC123",
        enderecoIp: "192.168.1.100",
        estaNaRede: true,
        dataInstalacao: "2024-01-01T00:00:00.000Z",
        contadorInstalacaoPB: 1000,
        contadorInstalacaoCor: 500,
        contadorAtualPB: 1200,
        contadorAtualCor: 600,
        localizacao: "São Paulo;Workstation A;SubWorkstation 1",
        modeloId: "modeloXYZ",
        ativo: true,
      };

      const { error } = createImpressoraValidator.validate(validData);
      expect(error).toBeUndefined();
    });

    it("should invalidate a missing required field", () => {
      const invalidData = {
        numContrato: "12345",
        enderecoIp: "192.168.1.100",
        estaNaRede: true,
        dataInstalacao: "2024-01-01T00:00:00.000Z",
        contadorInstalacaoPB: 1000,
        contadorInstalacaoCor: 500,
        contadorAtualPB: 1200,
        contadorAtualCor: 600,
        localizacao: "São Paulo;Workstation A;SubWorkstation 1",
        modeloId: "modeloXYZ",
        // numSerie e ativo estão faltando
      };

      const { error } = createImpressoraValidator.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain("numSerie");
    });

    it("should invalidate enderecoIp if estaNaRede is true but the IP is invalid", () => {
      const invalidData = {
        numContrato: "12345",
        numSerie: "ABC123",
        enderecoIp: "invalid-ip",
        estaNaRede: true,
        dataInstalacao: "2024-01-01T00:00:00.000Z",
        contadorInstalacaoPB: 1000,
        contadorInstalacaoCor: 500,
        contadorAtualPB: 1200,
        contadorAtualCor: 600,
        localizacao: "São Paulo;Workstation A;SubWorkstation 1",
        modeloId: "modeloXYZ",
        ativo: true,
      };

      const { error } = createImpressoraValidator.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain(
        'Error code "custom" is not defined, your custom type is missing the correct messages definition'
      );
    });

    it("should invalidate localizacao if it does not have three parts", () => {
      const invalidData = {
        numContrato: "12345",
        numSerie: "ABC123",
        enderecoIp: "192.168.1.100",
        estaNaRede: true,
        dataInstalacao: "2024-01-01T00:00:00.000Z",
        contadorInstalacaoPB: 1000,
        contadorInstalacaoCor: 500,
        contadorAtualPB: 1200,
        contadorAtualCor: 600,
        localizacao: "São Paulo;Workstation A", // Faltando a terceira parte
        modeloId: "modeloXYZ",
        ativo: true,
      };

      const { error } = createImpressoraValidator.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain(
        "localizacao deve conter três partes"
      );
    });
  });

  describe("updateImpressoraValidator", () => {
    it("should validate a valid printer update payload", () => {
      const validData = {
        numContrato: "12345",
        numSerie: "ABC123",
        enderecoIp: "192.168.1.100",
        estaNaRede: true,
        dataInstalacao: "2024-01-01T00:00:00.000Z",
        contadorInstalacaoPB: 1000,
        contadorInstalacaoCor: 500,
        contadorAtualPB: 1200,
        contadorAtualCor: 600,
        localizacao: "São Paulo;Workstation A;SubWorkstation 1",
        modeloId: "modeloXYZ",
        ativo: true,
      };

      const { error } = updateImpressoraValidator.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should invalidate enderecoIp if estaNaRede is false but the IP is not "0.0.0.0"', () => {
      const invalidData = {
        numContrato: "12345",
        numSerie: "ABC123",
        enderecoIp: "192.168.1.100", // IP inválido para estaNaRede === false
        estaNaRede: false,
        dataInstalacao: "2024-01-01T00:00:00.000Z",
        contadorInstalacaoPB: 1000,
        contadorInstalacaoCor: 500,
        contadorAtualPB: 1200,
        contadorAtualCor: 600,
        localizacao: "São Paulo;Workstation A;SubWorkstation 1",
        modeloId: "modeloXYZ",
        ativo: true,
      };

      const result = updateImpressoraValidator.validate(invalidData);
      expect(result.value.enderecoIp).toEqual("0.0.0.0");
    });

    it("should invalidate localizacao if it does not have three parts", () => {
      const invalidData = {
        numContrato: "12345",
        numSerie: "ABC123",
        enderecoIp: "192.168.1.100",
        estaNaRede: true,
        dataInstalacao: "2024-01-01T00:00:00.000Z",
        contadorInstalacaoPB: 1000,
        contadorInstalacaoCor: 500,
        contadorAtualPB: 1200,
        contadorAtualCor: 600,
        localizacao: "São Paulo;Workstation A", // Faltando a terceira parte
        modeloId: "modeloXYZ",
        ativo: true,
      };

      const { error } = updateImpressoraValidator.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain(
        "localizacao deve conter três partes"
      );
    });
  });

  describe("updateContadoresValidator", () => {
    it("should validate a valid printer counter update payload", () => {
      const validData = {
        contadorAtualPB: 1200,
        contadorAtualCor: 600,
      };

      const { error } = updateContadoresValidator.validate(validData);
      expect(error).toBeUndefined();
    });

    it("should invalidate negative counter", () => {
      const invalidData = {
        contadorAtualPB: -20,
        contadorAtualCor: 600,
      };

      const { error } = updateContadoresValidator.validate(invalidData);
      expect(error).toBeDefined()
      expect(error?.details[0].message).toContain(
        "O numero do contador deve ser maior que zero!"
      );
    });
  });
});
