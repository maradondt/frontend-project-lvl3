import * as yup from 'yup';

// const validateForm = (fields) => schema.isValid(fields);
const validateForm = (fields, urlCollection) => {
  const schema = yup.object().shape({
    url: yup.string()
      .url('is not url')
      .required('reqired')
      .notOneOf(urlCollection, 'This url already added'),
  });
  return schema.validate(fields);
};

export default validateForm;
