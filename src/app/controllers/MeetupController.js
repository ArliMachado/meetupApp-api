import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async index(req, res) {}

  async getMeetupsByUser(req, res) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
      attributes: ['id', 'title', 'description', 'location', 'date'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'image',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.string().required(),
      image_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const meetup = await Meetup.create({ ...req.body, user_id: req.userId });
    return res.json(meetup);
  }

  async update(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({ error: 'Not allowed update meetup' });
    }

    if (isBefore(meetup.date, new Date())) {
      return res
        .status(400)
        .json({ error: 'Updating past meetups is not allowed' });
    }

    const resp = await meetup.update(req.body);

    return res.json(resp);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({ error: "Is'n allowed delete meetup" });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({ error: 'Not allowed to delete past date' });
    }

    await meetup.destroy();

    return res.json();
  }
}

export default new MeetupController();
