import { Modal } from 'bootstrap';

const showModal = ({ title, link, description }) => {
  const modal = document.querySelector('#modal');
  const modalTitle = modal.querySelector('.modal-title');
  const btn = modal.querySelector('[role="button"]');
  const body = modal.querySelector('.modal-body');
  modalTitle.textContent = title;
  btn.href = link;
  body.textContent = description;
  // eslint-disable-next-line no-unused-vars
  const modalEl = new Modal(modal);
};

export default showModal;
