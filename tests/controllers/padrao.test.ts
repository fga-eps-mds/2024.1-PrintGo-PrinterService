import request from 'supertest';
import { server } from '../../src/server';
import { Padrao } from '../../src/types/Padrao.type';
import { prisma } from '../../src/database';


describe("PadraoCreate", () => {
    afterAll(() => {
        server.close();
    });

    beforeEach(async () => {
        await prisma.padrao.deleteMany({});
    })

    const padraoExemplo = {
        modelo: "Imprime Baixo 3000",
        marca: "Epston",
        colorido: false,
        oidModelo: "1.3.6.1.2.1.1.1.0",
        oidNumeroSerie: "1.3.6.1.2.1.43.5.1.1.17.1",
        oidFirmware: "1.3.6.1.2.1.43.5.1.1.16.1",
        oidTempoAtivo: "1.3.6.1.2.1.1.3.0",
        oidDigitalizacoes: "1.3.6.1.2.1.43.10.2.1.4.1.1",
        oidCopiasPB: "1.3.6.1.2.1.43.10.2.1.4.1.2",
        oidTotalGeral: "1.3.6.1.2.1.43.10.2.1.4.1.4"
      };
    
    it('sucesso ao criar padrao novo', async () => {
        const response = await request(server)
            .post('/padrao/create')
            .send(padraoExemplo);

        expect(response.status).toBe(201);
        for (const key in padraoExemplo) {
            expect(response.body[key]).toBe(padraoExemplo[key]);
        }
    });

    it('falha ao criar padrao sem campo obrigatorio', async () => {
        const { marca, ...padraoSemMarca } = padraoExemplo;

        const response = await request(server)
            .post('/padrao/create')
            .send(padraoSemMarca);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toContain("marca");
    });

    it('falha ao criar padrao com campo nao existente', async () => {
        const padraoExcesso = {nome: "João", ...padraoExemplo}

        const response = await request(server)
            .post('/padrao/create')
            .send(padraoExcesso);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toContain("nome");
    });

    it ('falha ao criar padrao com modelo e marca repetidos', async () => {
        const padraoRepetido = padraoExemplo;
        padraoRepetido.oidDigitalizacoes = "1.3.6.1.2.1.10.10.10.10.40.10.10";

        const response1 = await request(server)
            .post('/padrao/create')
            .send(padraoExemplo);
        expect(response1.status).toBe(201);
                
        const response2 = await request(server)
            .post('/padrao/create')
            .send(padraoRepetido);

        expect(response2.status).toBe(400);
    });
});
