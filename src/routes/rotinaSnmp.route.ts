import { Router } from 'express';
import RotinaSnmpController from '../controllers/RotinaSnmp.controller';
import { requestHandler } from '../middlewares/requestWrapper.adapter';

const rotinaSnmpRoutes = Router();

rotinaSnmpRoutes.post('/', requestHandler(RotinaSnmpController.createRotina));
rotinaSnmpRoutes.get('/', requestHandler(RotinaSnmpController.listRotinas));
rotinaSnmpRoutes.get('/:id', requestHandler(RotinaSnmpController.getRotina));
rotinaSnmpRoutes.patch('/:id', requestHandler(RotinaSnmpController.updateRotina));
rotinaSnmpRoutes.delete('/:id', requestHandler(RotinaSnmpController.deleteRotina));

export default rotinaSnmpRoutes;
