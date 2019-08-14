import { Op } from 'sequelize';
import { isSameHour, startOfDay, endOfDay } from 'date-fns';
import Meetup from '../models/Meetup';
import Subscrible from '../models/Subscrible';

class SubscribleController {
  async store(req, res) {
    const { meetup_id } = req.query;

    const meetup = await Meetup.findByPk(meetup_id);

    if (!meetup) {
      return res.status(400).json({ error: "Meetup does't exist" });
    }

    if (meetup.user_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'Unable to register for the meetup you organized' });
    }

    if (meetup.past) {
      return res
        .status(401)
        .json({ error: 'Unable to sign up for past meetup' });
    }

    const isSubscribled = await Subscrible.findOne({
      where: {
        meetup_id,
        user_id: req.userId,
      },
    });

    if (isSubscribled) {
      return res.status(401).json({ error: 'You are already subscribed' });
    }

    const checkDate = await Subscrible.findOne({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time" });
    }

    const subscrible = await Subscrible.create({
      meetup_id,
      user_id: req.userId,
    });

    return res.json(subscrible);
  }
}

export default new SubscribleController();
