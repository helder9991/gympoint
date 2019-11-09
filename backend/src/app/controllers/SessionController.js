import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

// Importação do segredo e data de expiração da autenticação JWT
import authConfig from '../../config/auth';

// Importação dos models
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const sessionSchema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await sessionSchema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fail' });

    const { email, password } = req.body;

    // Procura o usuario no banco de dados a partir do email
    const user = await User.findOne({ where: { email } });

    // Verifica se realmente existe um usuario com esse email
    if (!user) return res.status(400).json({ error: 'User not found' });

    // Verifica se a senha digitada bate com a senha salva no BD
    if (!(await user.checkPassword(password)))
      return res.status(401).json({ error: 'Password does not match' });

    const { id, name } = user;

    // Retorna [id,name, email] e o token de autenticação
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
