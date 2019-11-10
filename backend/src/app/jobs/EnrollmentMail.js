// Importação do Mail
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment } = data;

    Mail.sendMail({
      to: `${enrollment.student.name} <${enrollment.student.email}>`,
      subject: 'Realização da Matricula na Gym',
      template: 'enrollment',
      context: {
        student: enrollment.student.name,
        plan: enrollment.plan.title,
        duration: enrollment.plan.duration,
      },
    });
  }
}

export default new EnrollmentMail();
