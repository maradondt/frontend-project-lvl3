import i18next from 'i18next';

const removeFeedback = () => {
  const feedback = document.querySelector('.feedback');
  if (feedback.childNodes) {
    feedback.innerHTML = '';
  }
};

const renderSuccess = (message) => {
  const feedback = document.querySelector('.feedback');
  removeFeedback();
  feedback.textContent = i18next.t(`success.${message}`);
  feedback.classList.add('text-success');
};

export default function processStateHandler(value) {
  const input = document.querySelector('[name="url"]');
  const submit = document.querySelector('[type="submit"]');
  switch (value) {
    case ('filling'):
      input.readOnly = false;
      submit.disabled = false;
      break;
    case ('sending'):
      input.readOnly = true;
      submit.disabled = true;
      break;
    case ('finished'):
      renderSuccess(value);
      input.readOnly = false;
      submit.disabled = false;
      break;
    case ('failed'):
      // removeFeedback();
      input.readOnly = false;
      submit.disabled = false;
      break;
    default:
      console.log('Unknow state ', value);
      break;
  }
}
