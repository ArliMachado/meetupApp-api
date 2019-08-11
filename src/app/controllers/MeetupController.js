import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
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
}

export default new MeetupController();
