import { Router } from 'express';
import PadraoController from '../controllers/Padrao.controller';
import { requestHandler } from '../middlewares/requestWrapper.adapter';

const padraoRoutes = Router();
padraoRoutes.post('/create', requestHandler(PadraoController.createPadrao)); //Create
padraoRoutes.get('/', requestHandler(PadraoController.listPadroes)); //Read
padraoRoutes.get('/:id', requestHandler(PadraoController.retrievePadrao)); //Retrive
padraoRoutes.put('/:id', requestHandler(PadraoController.updatePadrao)); //Update
padraoRoutes.patch('/desativar/:id', requestHandler(PadraoController.deletarPadrao)); //"Delete"
padraoRoutes.patch('/toggle/:id', requestHandler(PadraoController.togglePadrao)); //toggle => ativo = !ativo
// padraoRoutes.delete('/:id', requestHandler(PadraoController.deletePadraoById));

export default padraoRoutes;
