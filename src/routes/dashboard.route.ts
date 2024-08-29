import { Router } from 'express';
import { requestHandler } from '../middlewares/requestWrapper.adapter';
import DashboardController from '../controllers/Dashboard.controller';

const dashboardRoutes = Router();
dashboardRoutes.get('/total-impressoes', requestHandler(DashboardController.getTotalImpressions));
dashboardRoutes.get('/color-printers', requestHandler(DashboardController.getColorPrintersCount));
dashboardRoutes.get('/pb-printers', requestHandler(DashboardController.getPbPrintersCount));
dashboardRoutes.get('/all-printers-data', requestHandler(DashboardController.getAllPrintersData));
dashboardRoutes.get('/equipment-by-location', requestHandler(DashboardController.getEquipmentCountByLocation));
dashboardRoutes.get('/counter-by-type', requestHandler(DashboardController.getSumOfCountersByImpressionType));
dashboardRoutes.get('/filtro-opcoes', requestHandler(DashboardController.getFiltroOpcoes));

export default dashboardRoutes;