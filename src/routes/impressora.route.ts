import { Router } from 'express';
import ImpressoraController from '../controllers/Impressora.controller';
import { requestHandler } from '../middlewares/requestWrapper.adapter';

const impressoraRoutes = Router();
impressoraRoutes.post('/', requestHandler(ImpressoraController.createImpressora));
impressoraRoutes.get('/', requestHandler(ImpressoraController.listImpressoras));
impressoraRoutes.get('/reports', requestHandler(ImpressoraController.listImpressorasReports));
impressoraRoutes.patch('/:id', requestHandler(ImpressoraController.updateImpressora));
impressoraRoutes.delete('/:id', requestHandler(ImpressoraController.deleteImpressora));
// impressoraRoutes.patch('/:id', requestHandler(ImpressoraController.editImpressora));
// impressoraRoutes.patch('/desativar/:id', requestHandler(ImpressoraController.toggleImpressora));
// impressoraRoutes.delete('/:id', requestHandler(ImpressoraController.deleteImpressoraById));

export default impressoraRoutes;
