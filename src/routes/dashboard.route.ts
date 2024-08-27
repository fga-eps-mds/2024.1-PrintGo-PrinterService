import { Router } from 'express';
import ImpressoraController from '../controllers/Impressora.controller';
import { requestHandler } from '../middlewares/requestWrapper.adapter';
import DashboardController from '../controllers/Dashboard.controller';

const dashboardRoutes = Router();
dashboardRoutes.get('/total-impressoes', requestHandler(DashboardController.getTotalImpressions));
dashboardRoutes.get('/color-printers', requestHandler(DashboardController.getColorPrintersCount));
dashboardRoutes.get('/pb-printers', requestHandler(DashboardController.getPbPrintersCount));

export default dashboardRoutes;