import request from 'supertest';
import { server } from '../../src/server';

describe('Location Controller', () => {

    afterAll(() => {
        server.close();
    });

    it('should list all locations and return a 201 status', async () => {
        const response = await request(server)
            .get('/location');
        console.log(response.body);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Sucesso: Localizações listadas com sucesso!');
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data).toHaveLength(3);
        expect(response.body.data[0]).toHaveProperty('id');
        expect(response.body.data[0]).toHaveProperty('name');
        expect(response.body.data[0]).toHaveProperty('state');
        expect(response.body.data[0].workstations).toBeInstanceOf(Array);
    });
});

