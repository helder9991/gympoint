import { Router } from 'express';

// Importação dos Controllers
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import HelpOrderAdmController from './app/controllers/HelpOrderAdmController';
import HelpOrderStuController from './app/controllers/HelpOrderStuController';

// Importação dos middlewares
import authMiddleware from './app/middlewares/auth';

const routes = Router();

routes.post('/session', SessionController.store);

routes.get('/students/:id/help-orders', HelpOrderStuController.index);
routes.post('/students/:id/help-orders', HelpOrderStuController.store);

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

routes.get('/help-orders/open', HelpOrderAdmController.index);
routes.post('/help-orders/:id/answer', HelpOrderAdmController.store);

export default routes;
