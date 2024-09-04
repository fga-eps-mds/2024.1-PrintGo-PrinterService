import { Router } from 'express';
import { requestHandler } from '../middlewares/requestWrapper.adapter';
import DashboardController from '../controllers/Dashboard.controller';

const dashboardRoutes = Router();
dashboardRoutes.get('/filtro-opcoes', requestHandler(DashboardController.getFiltroOpcoes));
dashboardRoutes.get('/dashboard-data', requestHandler(DashboardController.getDashboardData));

export default dashboardRoutes;