import * as Yup from 'yup';

const Create = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
  password: Yup.string().required(),
});

module.exports = { Create };
