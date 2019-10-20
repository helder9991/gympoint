import Sequelize from 'sequelize';

// Importação de Models
import User from '../app/models/User';
import Student from '../app/models/Student';

// Importação da configuração do banco de dados
import databaseConfig from '../config/database';

const models = [User, Student];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Realiza conexão com o banco de dados
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
