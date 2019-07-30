import User from '../models/User';
import UserSchema from '../models/schemaValidators/User';

class UserController {
  async store(req, res) {
    if (!(await UserSchema.Create.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email } = await User.create(req.body);
    return res.json({ id, name, email });
  }
}

export default new UserController();