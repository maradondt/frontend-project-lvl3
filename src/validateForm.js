import * as yup from 'yup';

yup.setLocale({
  string: {
    url: 'url',
  },
  mixed: {
    default: 'Invalid',
    notOneOf: 'arr',
  },
});

// const validateForm = (fields) => schema.isValid(fields);
const validateForm = (fields, urlCollection) => {
  const schema = yup.object().shape({
    url: yup.string()
      .url()
      .required()
      .notOneOf(urlCollection),
  });
  return schema.validate(fields);
};

export default validateForm;
