import * as Yup from 'yup';
import { isBefore, parseISO, addMonths, format } from 'date-fns';

// Importação das Lib
import Queue from '../../lib/Queue';

// Importação dos Jobs
import EnrollmentMail from '../jobs/EnrollmentMail';

// Importação do Model
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';

class EnrollmentController {
  async store(req, res) {
    const storeSchema = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .required(),
      plan_id: Yup.number()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await storeSchema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fail' });

    const { student_id, plan_id, start_date } = req.body;

    // Verifica se o usuario existe
    const student = await Student.findByPk(student_id);
    if (!student) return res.status(400).json({ error: 'User doesnt exists' });

    // Verifica se o plano existe
    const plan = await Plan.findByPk(plan_id);
    if (!plan) return res.status(400).json({ error: 'Plan doesnt exists' });

    // Verifica se a data de inicio já expirou
    if (isBefore(parseISO(start_date), new Date()))
      return res.status(400).json({ error: 'Date has expired' });

    const end_date = format(
      addMonths(parseISO(start_date), plan.duration),
      "yyyy-MM-dd'T'HH:mmxxx"
    );

    const price = plan.price * plan.duration;

    await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    const enrollment = await Enrollment.findOne({
      where: {
        student_id,
        start_date,
        end_date,
      },
      attributes: ['student_id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration'],
        },
      ],
    });

    await Queue.add(EnrollmentMail.key, { enrollment });

    return res.json(enrollment);
  }

  async index(req, res) {
    const enrollment = await Enrollment.findAll({
      where: { student_id: req.params.student_id },
    });

    if (enrollment.length === 0)
      return res.status(400).json({ error: 'Enrollment dont found' });

    return res.json(enrollment);
  }

  async update(req, res) {
    const updateSchema = Yup.object().shape({
      student_id: Yup.number().integer(),
      plan_id: Yup.number().integer(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      price: Yup.number(),
    });

    if (!(await updateSchema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fail' });

    const { student_id, plan_id, start_date } = req.body;

    // Verifica se o usuario existe
    const student = await Student.findByPk(student_id);
    if (!student) return res.status(400).json({ error: 'User doesnt exists' });

    // Verifica se o plano existe
    const plan = await Plan.findByPk(plan_id);
    if (!plan) return res.status(400).json({ error: 'Plan doesnt exists' });

    // Verifica se a data de inicio já expirou
    if (isBefore(parseISO(start_date), new Date()))
      return res.status(400).json({ error: 'Date has expired' });

    const end_date = format(
      addMonths(parseISO(start_date), plan.duration),
      "yyyy-MM-dd'T'HH:mmxxx"
    );

    const price = plan.price * plan.duration;

    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment)
      return res.status(400).json({ error: 'Enrollment doesnt exists' });

    await enrollment.update({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json({ student_id, plan_id, start_date, end_date, price });
  }

  async delete(req, res) {
    const deleteSchema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
    });

    const { id } = req.params;

    if (!(await deleteSchema.isValid(id)))
      return res.status(400).json({ error: 'Validation fail' });

    // Verifica se existe uma matricula com esse id
    const enrollmentExists = Enrollment.findByPk(id);
    if (!enrollmentExists)
      return res.status(400).json({ error: 'Enrollment doesnt exists' });

    await Enrollment.destroy({ where: { id: req.params.id } });

    return res.json({ message: 'Enrollment deleted' });
  }
}

export default new EnrollmentController();
