import { Router } from 'express';
import ImpressoraController from '../controllers/Impressora.controller';
import { requestHandler } from '../middlewares/requestWrapper.adapter';

const impressoraRoutes = Router();
impressoraRoutes.post('/', requestHandler(ImpressoraController.createImpressora));
impressoraRoutes.get('/', requestHandler(ImpressoraController.listImpressoras));
impressoraRoutes.patch('/:id', requestHandler(ImpressoraController.updateImpressora));
impressoraRoutes.delete('/:id', requestHandler(ImpressoraController.deleteImpressora));
impressoraRoutes.get('/:id', requestHandler(ImpressoraController.getImpressora));

export default impressoraRoutes;
