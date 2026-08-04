import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface SignInModalProps {
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: '/login' });
    onClose();
  }, [navigate, onClose]);

  return null;
};

export default SignInModal;
