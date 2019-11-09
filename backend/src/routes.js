import { Router } from 'express';

// Importação dos Controllers
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

// Importação dos middlewares
import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controllers/PlanController';

const routes = Router();

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

export default routes;
