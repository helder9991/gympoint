import * as Yup from 'yup';

// Importação dos Models
import HelpOrder from '../models/HelpOrder';

class HelpOrderAdmController {
  async store(req, res) {
    const storeSchema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .positive()
        .required(),
      answer: Yup.string().required(),
    });

    const { id } = req.params;
    const { answer } = req.body;

    if (!(await storeSchema.isValid({ id, answer })))
      return res.status(400).json({ error: 'Validation fail' });

    // Procura a pergunta em especifica no BD
    const helpOrder = await HelpOrder.findByPk(id);

    // Verifica se ela realmente existe
    if (!helpOrder)
      return res.status(400).json({ error: 'Help order doesnt exists' });

    // Verifica se ela ja foi respondida
    if (helpOrder.answer)
      return res.status(400).json({ error: 'Help order has been answered' });

    const answer_at = new Date();

    // Atualiza o BD com a resposta dada
    await helpOrder.update({ answer, answer_at });

    const { student_id, question } = helpOrder;
    return res.json({ student_id, question, answer });
  }

  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer_at: null,
      },
    });

    if (!helpOrders)
      return res.status(400).json({ error: 'Help Orders is empty' });

    return res.json(helpOrders);
  }
}

export default new HelpOrderAdmController();
