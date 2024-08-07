import { Router } from 'express';
import LocadoraController from '../controllers/Locadora.controller';
import { requestHandler } from '../middlewares/requestWrapper.adapter';

const locadoraRoutes = Router();
locadoraRoutes.post('/', requestHandler(LocadoraController.createLocadoraReport));

export default locadoraRoutes;

