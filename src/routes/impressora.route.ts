import { Router } from 'express';
import ImpressoraController from '../controllers/Impressora.controller';
import { requestHandler } from '../middlewares/requestWrapper.adapter';

const impressoraRoutes = Router();
impressoraRoutes.post('/', requestHandler(ImpressoraController.createImpressora));
impressoraRoutes.get('/', requestHandler(ImpressoraController.listImpressoras));
impressoraRoutes.get('/reports', requestHandler(ImpressoraController.listImpressorasReports));
impressoraRoutes.get('/:id', requestHandler(ImpressoraController.getImpressora));
impressoraRoutes.patch('/:id', requestHandler(ImpressoraController.updateImpressora));
impressoraRoutes.patch('/contadores/:id', requestHandler(ImpressoraController.updateContadores));
impressoraRoutes.delete('/:id', requestHandler(ImpressoraController.deleteImpressora));

export default impressoraRoutes;
