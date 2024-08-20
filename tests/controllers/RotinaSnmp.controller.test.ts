import request from 'supertest';
import { server } from '../../src/server'; // Importe o servidor existente da sua aplicação
import { prisma } from '../../src/database'; // Importe o cliente Prisma
import { id } from 'date-fns/locale';

// Exemplo de objeto RotinaSnmp para usar nos testes

describe('RotinaSnmp Controller Integration Tests', () => {
    const exemploRotina = {
        id: 1,
        localizacao: 'São Paulo',
        dataCriado: new Date(),
        dataUltimoUpdate: new Date(),
        cronExpression: '0 0 * * *', // Cron expression que representa meia-noite todo dia
        ativo: true,
        cidadeTodas: false,
        regionalTodas: false,
        unidadeTodas: true,
    };
    const url_create = '/rotina';
    const url_get = (id: number) => `/rotina/${id}`;
    const url_list = '/rotina';
    const url_update = (id: number) => `/rotina/${id}`;
    const url_delete = (id: number) => `/rotina/${id}`;


    const criaRotina = async (id?: number) => {
        if(id) {
            const dadosRotina = { ...exemploRotina, id };
            await prisma.rotinaSnmp.create({ data: dadosRotina });
            return;
        }
        const dadosRotina = exemploRotina;
        await prisma.rotinaSnmp.create({ data: dadosRotina });
    };

    // Após todos os testes, fecha o servidor
    afterAll(() => {
        server.close();
    });

    // Após cada teste, limpa a tabela 'RotinaSnmp'
    afterEach(async () => {
        await prisma.rotinaSnmp.deleteMany({});
        jest.clearAllMocks();
    });

    describe("RotinaSnmp Create", () => {
        it('sucesso ao criar rotina nova', async () => {
            const response = await request(server)
                .post(url_create)
                .send(exemploRotina);
        
            expect(response.status).toBe(201);
            for (const key in exemploRotina) {
                if (Object.hasOwnProperty.call(exemploRotina, key)) {
                    if (exemploRotina[key] instanceof Date) {
                        expect(new Date(response.body[key]).toISOString()).toBe(exemploRotina[key].toISOString());
                    } else {
                        expect(response.body[key]).toBe(exemploRotina[key]);
                    }
                }
            }
        });

        it('falha ao criar rotina sem campo obrigatorio', async () => {
            const { cronExpression, ...rotinaSemCron } = exemploRotina;

            const response = await request(server)
                .post(url_create)
                .send(rotinaSemCron);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("cronExpression");
        });

        it('falha ao criar rotina com campo nao existente', async () => {
            const rotinaExcesso = { nome: "João", ...exemploRotina };

            const response = await request(server)
                .post(url_create)
                .send(rotinaExcesso);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("nome");
        });

        it('throws 500 status from try/catch', async () => {
            jest.spyOn(require('../../src/repository/RotinaSnmp.repository'), 'createRotina')
                .mockImplementationOnce(() => {
                    throw new Error('Database error');
                });

            const response = await request(server)
                .post(url_create)
                .send(exemploRotina);

            expect(response.status).toBe(500);

            jest.restoreAllMocks();
        });
    })

    describe("RotinaSnmp Get", () => {
        it('sucesso ao obter rotina existente', async () => {
            const createdRotina = await request(server)
                .post(url_create)
                .send(exemploRotina);

            const response = await request(server).get(url_get(createdRotina.body.id));

            expect(response.status).toBe(200);
            for (const key in exemploRotina) {
                if (Object.hasOwnProperty.call(exemploRotina, key)) {
                    if (exemploRotina[key] instanceof Date) {
                        expect(new Date(response.body[key]).toISOString()).toBe(exemploRotina[key].toISOString());
                    } else {
                        expect(response.body[key]).toBe(exemploRotina[key]);
                    }
                }
            }
        });

        it('falha ao obter rotina inexistente', async () => {
            const response = await request(server).get(url_get(99999)); // ID que não existe

            expect(response.status).toBe(404);
            expect(response.text).toBe('Rotina SNMP não encontrada');
        });

        it('throws 500 status from try/catch', async () => {
            jest.spyOn(require('../../src/repository/RotinaSnmp.repository'), 'getRotinaById')
                .mockImplementationOnce(() => {
                    throw new Error('Database error');
                });

            const response = await request(server).get(url_get(1));

            expect(response.status).toBe(500);

            jest.restoreAllMocks();
        });
    });

    describe("RotinaSnmp List", () => {
        it('sucesso ao listar todas as rotinas', async () => {
            await criaRotina();
            const response = await request(server).get(url_list);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('throws 500 status from try/catch', async () => {
            jest.spyOn(require('../../src/repository/RotinaSnmp.repository'), 'listRotinas')
                .mockImplementationOnce(() => {
                    throw new Error('Database error');
                });

            const response = await request(server).get(url_list);

            expect(response.status).toBe(500);

            jest.restoreAllMocks();
        });
    });

    describe("RotinaSnmp Update", () => {
        it('sucesso ao atualizar uma rotina existente', async () => {
            await criaRotina();

            const updatedData = exemploRotina;
            updatedData.localizacao = 'Rio de Janeiro';
            const response = await request(server)
                .patch(url_update(exemploRotina.id))
                .send(updatedData);
            console.log("aquiii", response.body);

            expect(response.status).toBe(200);
            expect(response.body.localizacao).toBe('Rio de Janeiro');
        });

        it('falha ao atualizar uma rotina inexistente', async () => {
            const response = await request(server)
                .patch(url_update(99999)) // ID que não existe
                .send({ localizacao: 'Non-existent Rotina' });
    
            expect(response.status).toBe(404);
            expect(response.text).toBe('Rotina SNMP não encontrada');
        });

        it('throws 500 status from try/catch', async () => {
            jest.spyOn(require('../../src/repository/RotinaSnmp.repository'), 'updateRotina')
                .mockImplementationOnce(() => {
                    throw new Error('Database error');
                });

            const response = await request(server)
                .patch(url_update(1))
                .send({ localizacao: 'Trigger Server Error' });

            expect(response.status).toBe(500);

            jest.restoreAllMocks();
        });
    });

    describe("RotinaSnmp Delete", () => {
        it('sucesso ao deletar uma rotina existente', async () => {
            await criaRotina();

            const response = await request(server).delete(url_delete(exemploRotina.id));

            expect(response.status).toBe(204);
        });

        it('falha ao deletar uma rotina inexistente', async () => {
            const response = await request(server).delete(url_delete(99999));

            expect(response.status).toBe(404);
            expect(response.text).toBe('Rotina SNMP não encontrada');
        });

        it('throws 500 status from try/catch', async () => {
            jest.spyOn(require('../../src/repository/RotinaSnmp.repository'), 'deleteRotina')
                .mockImplementationOnce(() => {
                    throw new Error('Database error');
                });

            const response = await request(server).delete(url_delete(1));

            expect(response.status).toBe(500);

            jest.restoreAllMocks();
        });
    });

});
