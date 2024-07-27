import { Request, Response } from 'express';
import { Padrao } from '../types/Padrao.type';
import { listPadroes, createPadrao, editPadrao } from '../repository/Padrao.repository';
import { createPadraoValidator } from './validators/Padrao.validator';


export default {
    async createPadrao(request: Request, response: Response) {
        const { error, value } = createPadraoValidator.validate(request.body);
        if (error) {
            return response.status(400).json({error: error.message});
        }

        try {
            const padraoBody = value as Padrao;
            const newPadrao = await createPadrao(padraoBody);
            if (!newPadrao.valueOf()) {
                return response.status(400).send();
            }
            return response.status(201).json(newPadrao);

        }
        catch (error) {
            return response.status(500).send();
        }
    },
    async listPadroes(request: Request, response: Response) {
        try {
            const padroes = await listPadroes();
            return response.status(200).json(padroes);
        }
        catch(error){
            return response.status(500).send();
        }
    },

    async updatePadrao(resquest: Request, response: Response){
        const { error, value } = createPadraoValidator.validate(resquest.body);
        if (error) {
            return response.status(400).json({error: error.message});
        }
        try {

            const numberID = parseInt(resquest.params.id as string)
            console.log(numberID)
            console.log(resquest.params.id)
            const updatePadrao = await editPadrao(numberID, value as Padrao)
            return response.status(200).json(updatePadrao);

        } catch (error) {
            console.log(error)
            return response.status(500).send();
        }

    }

}
