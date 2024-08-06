import { Router } from 'express';
import ImpressoraController from '../controllers/Impressora.controller';
import { requestHandler } from '../middlewares/requestWrapper.adapter';

const impressoraRoutes = Router();
impressoraRoutes.post('/', requestHandler(ImpressoraController.createImpressora));
impressoraRoutes.get('/', requestHandler(ImpressoraController.listImpressoras));
impressoraRoutes.get('/:id', requestHandler(ImpressoraController.getImpressora));
impressoraRoutes.get('/reports', requestHandler(ImpressoraController.listImpressorasReports));
impressoraRoutes.patch('/:id', requestHandler(ImpressoraController.updateImpressora));
impressoraRoutes.delete('/:id', requestHandler(ImpressoraController.deleteImpressora));
impressoraRoutes.patch('/addContadores', requestHandler(ImpressoraController.addContadores));

export default impressoraRoutes;
