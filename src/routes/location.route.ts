import { Router } from 'express';
import LocationController from '../controllers/Location.controller'
import { requestHandler } from '../middlewares/requestWrapper.adapter';

const locationRoutes = Router();
locationRoutes.get('/', requestHandler(LocationController.listLocations));

export default locationRoutes;

