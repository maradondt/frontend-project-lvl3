import * as yup from 'yup';

const schema = yup.object().shape({
  url: yup.string().url().required(),
});

// const validateForm = (fields) => schema.isValid(fields);
const validateForm = (fields) => {
  console.log(fields);
  schema.isValid(fields).then(console.log);
  return schema.isValid(fields);
};

export default validateForm;
