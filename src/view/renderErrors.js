import i18next from 'i18next';

const renderErrors = (errors) => {
  const feedback = document.querySelector('.feedback');
  if (!errors.length) {
    feedback.textContent = '';
    feedback.classList.remove('text-danger');
  } else {
    errors.forEach((err) => {
      feedback.textContent = i18next.t(`errors.${err}`);
      feedback.classList.add('text-danger');
    });
  }
};

export default renderErrors;
