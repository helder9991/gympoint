import * as Yup from 'yup';

// Importação do Model
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    // Verifica se os dados recebidos estão no padrão certo
    const storeSchema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number()
        .integer()
        .positive()
        .required(),
      peso: Yup.number()
        .positive()
        .required(),
      altura: Yup.number()
        .positive()
        .required(),
    });

    if (!(await storeSchema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fail' });

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists)
      return res.status(400).json({ error: 'Student already exists' });

    const { id, name, email, idade, peso, altura } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura,
    });
  }

  async update(req, res) {
    // Verifica se os dados recebidos estão no padrão certo
    const updateSchema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number()
        .integer()
        .positive(),
      peso: Yup.number().positive(),
      altura: Yup.number().positive(),
    });

    if (!(await updateSchema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fail' });

    const { email } = req.body;

    const user = await Student.findOne({ where: { email } });

    if (!user) return res.status(400).json({ error: 'User exists' });

    const { name, altura, idade, peso } = await user.update(req.body);

    return res.json({ name, email, altura, idade, peso });
  }
}

export default new StudentController();
