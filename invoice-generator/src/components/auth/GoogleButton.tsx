import { Button, Image, Text, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface GoogleButtonProps {
  label?: string;
}

export const GoogleButton = ({ label = 'Continue with Google' }: GoogleButtonProps) => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await signInWithGoogle();
    // Note: Loading state will persist as page redirects to Google
  };

  return (
    <Button
      variant="outline"
      w="100%"
      onClick={handleClick}
      isLoading={isLoading}
      loadingText="Redirecting..."
    >
      <Flex align="center" gap={2}>
        <Image
          src="https://www.google.com/favicon.ico"
          alt="Google"
          w="16px"
          h="16px"
        />
        <Text>{label}</Text>
      </Flex>
    </Button>
  );
};
