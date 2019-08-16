import Mail from '../../lib/Mail';

class SubscribledMail {
  get key() {
    return 'SubscribledMail';
  }

  async handle({ data }) {
    const { meetup } = data;

    await Mail.sendMail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: `Nova inscrição no meetup ${meetup.title}`,
      template: 'subscription',
      context: {
        meetup: meetup.title,
        user: meetup.user.name,
      },
    });
  }
}

export default new SubscribledMail();
