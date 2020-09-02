import { Router } from 'express';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.getUser);
routes.post('/users', UserController.store);
routes.patch('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);

export default routes;

