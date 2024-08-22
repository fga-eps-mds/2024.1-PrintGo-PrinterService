import { Router } from 'express';
import ReportController from '../controllers/Report.controller';
import { requestHandler } from '../middlewares/requestWrapper.adapter';

const reportRoutes = Router();

reportRoutes.get('/contract/:contractId', requestHandler(ReportController.listImpressorasContractReports));
reportRoutes.get('/month/:id', requestHandler(ReportController.retrieveMonthReport));
reportRoutes.get('/:id', requestHandler(ReportController.retrieveReport));

export default reportRoutes;
