import request from 'supertest';
import { server } from '../../src/server';
import { Padrao } from '../../src/types/Padrao.type';
import { prisma } from '../../src/database';


describe("Padrao Controller", () => {

    afterAll(() => {
        server.close();
    });

    afterEach(async () => {
        await prisma.padrao.deleteMany({});
    });

    const padraoExemplo = {
        modelo: "Imprime Baixo 3000",
        marca: "Epston",
        colorido: false,
        tipo: "Multifuncional laser colorido",
        oidModelo: "1.3.6.1.2.1.1.1.0",
        oidNumeroSerie: "1.3.6.1.2.1.43.5.1.1.17.1",
        oidFirmware: "1.3.6.1.2.1.43.5.1.1.16.1",
        oidTempoAtivo: "1.3.6.1.2.1.1.3.0",
        oidDigitalizacoes: "1.3.6.1.2.1.43.10.2.1.4.1.1",
        oidCopiasPB: "1.3.6.1.2.1.43.10.2.1.4.1.2",
        oidTotalGeral: "1.3.6.1.2.1.43.10.2.1.4.1.4"
    };

    const criaPadrao = async (modelo: string) => {
        const dadosPadrao = padraoExemplo;
        dadosPadrao.modelo = modelo;
        await prisma.padrao.create({ data: dadosPadrao });
    };

    describe("Padrao Create", () => {
        const url_create = '/padrao/create'

        it('sucesso ao criar padrao novo', async () => {
            const response = await request(server)
                .post(url_create)
                .send(padraoExemplo);

            expect(response.status).toBe(201);
            for (const key in padraoExemplo) {
                expect(response.body[key]).toBe(padraoExemplo[key]);
            }
        });

        it('falha ao criar padrao sem campo obrigatorio', async () => {
            const { marca, ...padraoSemMarca } = padraoExemplo;

            const response = await request(server)
                .post(url_create)
                .send(padraoSemMarca);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("marca");
        });

        it('falha ao criar padrao com campo nao existente', async () => {
            const padraoExcesso = { nome: "João", ...padraoExemplo };

            const response = await request(server)
                .post(url_create)
                .send(padraoExcesso);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("nome");
        });

        it('falha ao criar padrao com modelo e marca repetidos', async () => {
            const padraoRepetido = padraoExemplo;
            padraoRepetido.oidDigitalizacoes = "1.3.6.1.2.1.10.10.10.10.40.10.10";

            const response1 = await request(server)
                .post(url_create)
                .send(padraoExemplo);
            expect(response1.status).toBe(201);

            const response2 = await request(server)
                .post(url_create)
                .send(padraoRepetido);

            expect(response2.status).toBe(400);
        });

        it('throws 500 status from try/catch', async () => {
            jest.spyOn(require('../../src/repository/Padrao.repository'), 'createPadrao')
                .mockImplementationOnce(() => {
                    throw new Error('Database error');
                });

            const response = await request(server)
                .post(url_create)
                .send(padraoExemplo);

            expect(response.status).toBe(500);

            jest.restoreAllMocks();
        });
    });

    describe("Padrao List", () => {
        const url_list = '/padrao';

        it('sucesso ao listar um padrao', async () => {
            await criaPadrao("modelo1");

            const response = await request(server)
                .get(url_list)
                .send();
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
        });

        it('sucesso ao listar multiplos padroes', async () => {
            for (let i = 1; i <= 10; i++) {
                await criaPadrao("modelo" + i.toString());
            }

            const response = await request(server)
                .get(url_list)
                .send();
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(10);
        });

        it('sucesso ao listar zero padroes', async () => {
            const response = await request(server)
                .get(url_list)
                .send();
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(0);
        });

        it('throws 500 status from try/catch', async () => {
            jest.spyOn(require('../../src/repository/Padrao.repository'), 'listPadroes')
                .mockImplementationOnce(() => {
                    throw new Error('Database error');
                });

            const response = await request(server)
                .get(url_list)
                .send();

            expect(response.status).toBe(500);

            jest.restoreAllMocks();
        });
    });

    describe("Padrao Retrieve", () => {
        const url_retrieve = '/padrao/';

        it('sucesso no retrieve padrao', async () => {
            await criaPadrao("modelo1");

            const padrao = await prisma.padrao.findFirst({ where: { modelo: "modelo1" } });
            const id = padrao.id;

            const response = await request(server)
                .get(url_retrieve + id.toString())
                .send();

            expect(response.status).toBe(200);
            expect(response.body.modelo).toBe("modelo1");
        });

        it('falha ao retrieve padrao que não existe', async () => {
            const response = await request(server)
                .get(url_retrieve + "1")
                .send();

            expect(response.status).toBe(404);
        });

        it('throws 500 status from try/catch', async () => {
            jest.spyOn(require('../../src/repository/Padrao.repository'), 'getById')
                .mockImplementationOnce(() => {
                    throw new Error('Database error');
                });

            const response = await request(server)
                .get(url_retrieve + "1")
                .send();

            expect(response.status).toBe(500);

            jest.restoreAllMocks();
        });
    });

    describe("Padrao Update", () => {
        const url_update = '/padrao/';

        it('sucesso ao atualizar padrao', async () => {
            await criaPadrao("modelo1");
            const id = (await prisma.padrao.findFirst({ where: { modelo: "modelo1" } })).id;

            const padraoUpdate = padraoExemplo;
            padraoUpdate.modelo = "modeloAtualizado";

            const response = await request(server)
                .put(url_update + id)
                .send(padraoUpdate);

            expect(response.status).toBe(200);
            expect(response.body.modelo).toBe("modeloAtualizado");
        });

        it('falha ao atualizar padrao sem campo obrigatorio', async () => {
            await criaPadrao("modelo1");
            const id = (await prisma.padrao.findFirst({ where: { modelo: "modelo1" } })).id;

            const { marca, ...padraoSemMarca } = padraoExemplo;

            padraoSemMarca.modelo = "modeloAtualizado"

            const response = await request(server)
                .put(url_update + id)
                .send(padraoSemMarca);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("marca");
        });

        it('falha ao atualizar padrao com campo nao existente', async () => {
            await criaPadrao("modelo1");
            const id = (await prisma.padrao.findFirst({ where: { modelo: "modelo1" } })).id;

            const padraoExcesso = { nome: "João", ...padraoExemplo };

            const response = await request(server)
                .put(url_update + id)
                .send(padraoExcesso);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("nome");
        });

        it('falha ao atualizar padrao com modelo e marca repetidos', async () => {
            await criaPadrao("modelo1");
            const id = (await prisma.padrao.findFirst({ where: { modelo: "modelo1" } })).id;
            await criaPadrao("modelo2");

            const padraoRepetido = padraoExemplo;
            padraoRepetido.modelo = "modelo2";

            const response = await request(server)
                .put(url_update + id)
                .send(padraoRepetido);

            expect(response.status).toBe(404);
        });

        it('throws 500 status from try/catch', async () => {
            jest.spyOn(require('../../src/repository/Padrao.repository'), 'editPadrao')
                .mockImplementationOnce(() => {
                    throw new Error('Database error');
                });

            await criaPadrao("modelo1");
            const id = (await prisma.padrao.findFirst({ where: { modelo: "modelo1" } })).id;

            const response = await request(server)
                .put(url_update + id)
                .send(padraoExemplo);

            expect(response.status).toBe(500);

            jest.restoreAllMocks();
        });
    });

    describe("Padrao Delete", () => {
        const url_delete = "/padrao/";

        it('sucesso ao deletar padrao', async () => {
            await criaPadrao("modelo1");
            const id = (await prisma.padrao.findFirst({ where: { modelo: "modelo1" } })).id;

            const response = await request(server)
                .delete(url_delete + id)
                .send();

            expect(response.status).toBe(204);

            const padrao = await prisma.padrao.findFirst({ where: { modelo: "modelo1" } });
            expect(padrao.ativo).toBeFalsy();
        });

        it('falha ao deletar padrao inexistente', async () => {
            const response = await request(server)
                .delete(url_delete + "1")
                .send();

            expect(response.status).toBe(404);
        });

        it('throws 500 status from try/catch', async () => {
            jest.spyOn(require('../../src/repository/Padrao.repository'), 'desativarPadrao')
                .mockImplementationOnce(() => {
                    throw new Error('Database error');
                });

            await criaPadrao("modelo1");
            const id = (await prisma.padrao.findFirst({ where: { modelo: "modelo1" } })).id;

            const response = await request(server)
                .delete(url_delete + id)
                .send();

            expect(response.status).toBe(500);

            jest.restoreAllMocks();
        });
    });

    describe("Padrao Toggle", () => {
        it('sucesso ao ativar padrao', async () => {
            await criaPadrao("modelo1");
            const id = (await prisma.padrao.findFirst({ where: { modelo: "modelo1" } })).id;

            const response = await request(server)
                .patch(`/padrao/toggle/${id}`)
                .send();

            expect(response.status).toBe(200);
        });
    });
});
