import * as Yup from 'yup';

// Importação dos Models
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const storeSchema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number().required(),
    });

    if (!(await storeSchema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fail' });

    const planExists = await Plan.findOne({ where: { title: req.body.title } });

    if (planExists)
      return res.status(400).json({ error: 'Plan already exists' });

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });

    if (!plans)
      return res.status(400).json({ error: 'There are no registed plans' });

    return res.json(plans);
  }

  async update(req, res) {
    const updateSchema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
      title: Yup.string(),
      duration: Yup.number().integer(),
      price: Yup.number(),
    });

    req.body.id = req.params.id;

    if (!(await updateSchema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fail' });

    const plan = await Plan.findByPk(req.body.id);

    if (!plan) return res.status(400).json({ error: 'Plan doesnt exists' });

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({ id, title, duration, price });
  }

  async delete(req, res) {
    const deleteSchema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
    });

    const { id } = req.params;

    if (!(await deleteSchema.isValid({ id })))
      return res.status(400).json({ error: 'Validation fail' });

    const planExists = await Plan.findByPk(id);

    if (!planExists)
      return res.status(400).json({ error: 'Plan doenst exists' });

    await Plan.destroy({ where: { id } });

    return res.json({ message: 'Plan deleted' });
  }
}

export default new PlanController();
