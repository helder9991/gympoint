import Sequelize from 'sequelize';

// Importação de Models
import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Enrollment from '../app/models/Enrollment';
import HelpOrder from '../app/models/HelpOrder';

// Importação da configuração do banco de dados
import databaseConfig from '../config/database';

const models = [User, Student, Plan, Enrollment, HelpOrder];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Realiza conexão com o banco de dados
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
