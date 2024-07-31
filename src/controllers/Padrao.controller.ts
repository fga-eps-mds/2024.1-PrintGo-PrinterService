import { Request, Response } from 'express';
import { Padrao } from '../types/Padrao.type';
import { listPadroes, createPadrao, editPadrao, desativarPadrao, getById, togglePadrao } from '../repository/Padrao.repository';
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

    async retrievePadrao(request: Request, response: Response) {
        try {
            const numberID = parseInt(request.params.id as string)
            const padroes = await getById(numberID);
            if (!padroes){ 
                return response.status(404).json({error: "Padrão não encontrado"});
            }                   
            return response.status(200).json(padroes);
        }
        catch(error){
            return response.status(500).send();
        }
    },

    async updatePadrao(request: Request, response: Response){
        const { error, value } = createPadraoValidator.validate(request.body);
        if (error) {
            return response.status(400).json({error: error.message});
        }
        try {

            const numberID = parseInt(request.params.id as string)
            const updatePadrao = await editPadrao(numberID, value as Padrao)
            if (!updatePadrao) {
                return response.status(404).json({ error: "Padrão não encontrado" });
            }
            return response.status(200).json(updatePadrao);

        } catch (error) {
            console.log(error)
            return response.status(500).send();
        }

    },

    async deletarPadrao(request: Request, response: Response) {    
        try {
            const numberID = parseInt(request.params.id as string)
            const deletePadrao = await desativarPadrao(numberID)
            if (!deletePadrao) {
                return response.status(404).json({ error: "Padrão não encontrado" });
            }

            return response.status(204).json(deletePadrao);

        } catch (error) {
            console.log(error)
            return response.status(500).send();
        }
    },

    async togglePadrao(request: Request, response: Response){
        try {
            const numberID = parseInt(request.params.id as string)
            const padrao = await getById(numberID);
            
            if(padrao){
                const toggledPadrao = await togglePadrao(numberID,padrao.ativo);
                return response.status(200).json(toggledPadrao);
            }
        } catch (error) {
            console.log(error)
            return response.status(500).send();
        }
    }
}
