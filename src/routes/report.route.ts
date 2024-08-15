import { Router } from 'express';
import ReportController from '../controllers/Report.controller';
import { requestHandler } from '../middlewares/requestWrapper.adapter';

const reportRoutes = Router();

reportRoutes.get('/contract/:contractId', requestHandler(ReportController.listImpressorasContractReports));
reportRoutes.get('/:id', requestHandler(ReportController.retrieveReport));
reportRoutes.get('/month/:id', requestHandler(ReportController.retrieveMonthReport));

export default reportRoutes;
