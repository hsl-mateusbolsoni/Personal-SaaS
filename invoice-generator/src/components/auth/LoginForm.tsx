import { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onForgotPassword: () => void;
  onSuccess: () => void;
}

export const LoginForm = ({ onForgotPassword, onSuccess }: LoginFormProps) => {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error } = await signInWithEmail(email, password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <VStack gap={4} as="form" onSubmit={handleSubmit}>
      {error && (
        <Alert status="error" borderRadius="lg" fontSize="sm">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <FormControl>
        <FormLabel fontSize="sm" fontWeight="500">Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm" fontWeight="500">Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
        />
      </FormControl>

      <Flex w="100%" justify="flex-end">
        <Button
          variant="link"
          size="sm"
          color="accent.500"
          fontWeight="500"
          onClick={onForgotPassword}
        >
          Forgot password?
        </Button>
      </Flex>

      <Button
        type="submit"
        w="100%"
        isLoading={isLoading}
        loadingText="Signing in..."
      >
        Sign In
      </Button>
    </VStack>
  );
};
