// Importação do Model
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    console.log('a');

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });
    console.log('b');

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
}

export default new StudentController();
