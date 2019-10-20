import { Router } from 'express';

// Importação dos Controllers
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

// Importação dos middlewares
import authMiddleware from './app/middlewares/auth';

const routes = Router();

routes.post('/session', SessionController.store);
routes.post('/students', authMiddleware, StudentController.store);

export default routes;
