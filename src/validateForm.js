import * as yup from 'yup';

yup.setLocale({
  string: {
    url: 'invalid-url',
  },
  mixed: {
    default: 'Invalid',
    notOneOf: 'rss already exist',
  },
});

const validateForm = (urlCollection) => {
  const schema = yup.object().shape({
    url: yup.string()
      .url()
      .required()
      .notOneOf(urlCollection),
  });
  return schema;
};

export default validateForm;
