import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPassword } from './ForgotPassword';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = 'login' | 'signup' | 'forgot-password';

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [view, setView] = useState<View>('login');
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    setView(index === 0 ? 'login' : 'signup');
  };

  const handleForgotPassword = () => {
    setView('forgot-password');
  };

  const handleBackToLogin = () => {
    setView('login');
    setTabIndex(0);
  };

  const handleClose = () => {
    setView('login');
    setTabIndex(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader pb={0}>
          {view === 'forgot-password' ? 'Reset Password' : 'Welcome'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {view === 'forgot-password' ? (
            <ForgotPassword onBack={handleBackToLogin} onSuccess={handleBackToLogin} />
          ) : (
            <Tabs index={tabIndex} onChange={handleTabChange} variant="soft-rounded" colorScheme="purple">
              <TabList mb={4}>
                <Tab flex={1}>Sign In</Tab>
                <Tab flex={1}>Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <LoginForm onForgotPassword={handleForgotPassword} onSuccess={handleClose} />
                </TabPanel>
                <TabPanel p={0}>
                  <SignupForm onSuccess={handleClose} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
