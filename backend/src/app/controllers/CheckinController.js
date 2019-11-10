import * as Yup from 'yup';
import { subDays } from 'date-fns';
import { Op } from 'sequelize';

// Importação dos Models
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const indexSchema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    const { id } = req.params;

    if (!(await indexSchema.isValid({ id })))
      return res.status(400).json({ error: 'Validation fail' });

    // Busca usuario no BD
    const student = await Student.findByPk(id);

    // Verifica se o usuario existe
    if (!student)
      return res.status(400).json({ error: 'Student doesnt exists' });

    const date = new Date();

    // Busca todos os checkins do usuario
    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
        created_at: { [Op.gt]: subDays(date, 7) },
      },
      order: [['created_at', 'DESC']],
      limit: 6,
    });

    if (checkins.length >= 5)
      return res.status(400).json({ error: 'Student cannot check in' });

    await Checkin.create({ student_id: id });

    return res.json({ message: 'Student has checked in' });
  }

  async index(req, res) {
    const indexSchema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    const { id } = req.params;

    if (!(await indexSchema.isValid({ id })))
      return res.status(400).json({ error: 'Validation fail' });

    // Busca usuario no BD
    const student = await Student.findByPk(id);

    // Verifica se o usuario existe
    if (!student)
      return res.status(400).json({ error: 'Student doesnt exists' });

    // Busca todos os checkins do usuario
    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
      },
      attributes: ['student_id', ['created_at', 'date']],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    if (checkins.length === 0)
      return res.status(400).json({ error: 'Student has not checked in' });

    return res.json(checkins);
  }
}

export default new CheckinController();
