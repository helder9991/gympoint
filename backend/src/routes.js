import { Router } from 'express';

// Importação dos Controllers
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';

// Importação dos middlewares
import authMiddleware from './app/middlewares/auth';

const routes = Router();

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/enrollment', EnrollmentController.store);
routes.get('/enrollment/:student_id', EnrollmentController.index);
routes.put('/enrollment/:id', EnrollmentController.update);
routes.delete('/enrollment/:id', EnrollmentController.delete);

export default routes;
