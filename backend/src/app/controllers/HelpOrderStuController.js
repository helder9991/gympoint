import * as Yup from 'yup';

// Importação dos Models
import HelpOrder from '../models/HelpOrder';
import User from '../models/User';

class HelpOrderStuController {
  async store(req, res) {
    const storeSchema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .positive()
        .required(),
      question: Yup.string().required(),
    });

    const { id } = req.params;
    const { question } = req.body;

    if (!(await storeSchema.isValid({ id, question })))
      return res.status(400).json({ error: 'Validation fail' });

    const studentExists = await User.findByPk(id);

    if (!studentExists)
      return res.status(400).json({ error: 'Student doesnt exists' });

    // Cria a pergunta
    await HelpOrder.create({
      student_id: id,
      question,
    });

    return res.json({ student_id: id, question });
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

    // Procura perguntas apenas daquele usuario
    const helpOrders = await HelpOrder.findAll({
      where: {
        student_id: req.params.id,
      },
      attributes: ['question', 'answer', 'answer_at'],
    });

    if (helpOrders.length === 0)
      return res
        .status(400)
        .json({ error: 'This student doesnt have help order' });

    return res.json(helpOrders);
  }
}

export default new HelpOrderStuController();
