import { Request, Response } from 'express';
import { Padrao } from '../types/Padrao.type';
import { listPadroes, createPadrao } from '../repository/Padrao.repository';


export default {
    async createPadrao(request: Request, response: Response) {
        try {
            const padraoBody = request.body as Padrao;
            const newPadrao = await createPadrao(padraoBody);
            if (!newPadrao.valueOf()) {
                return response.status(400).send();
            }
            return response.status(201).json(newPadrao);

        } catch (error) {
            return response.status(500).send();
        }
    },
    async listPadroes(request: Request, response: Response){
        try{
            const padroes = await listPadroes();
            return response.status(200).json(padroes);
        }
        catch(error){
            return response.status(500).send();
        }
    }
}

