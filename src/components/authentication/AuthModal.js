import React from 'react';
import Modal from 'react-bootstrap/Modal';
import AuthForm from './AuthForm';

const AuthModal = ({ show, onHide, modalType }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{modalType === 'login' ? 'Login' : 'Sign Up'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="p-4">
          <AuthForm initialHasAccount={modalType === 'login'} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;