import { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Divider,
  Flex,
  Alert,
  AlertIcon,
  Box,
} from '@chakra-ui/react';
import { CheckCircle } from 'phosphor-react';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleButton } from './GoogleButton';

interface SignupFormProps {
  onSuccess: () => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const { signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const { error, needsConfirmation } = await signUpWithEmail(email, password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else if (needsConfirmation) {
      setShowConfirmation(true);
      setIsLoading(false);
    } else {
      onSuccess();
    }
  };

  if (showConfirmation) {
    return (
      <Box textAlign="center" py={4}>
        <Box color="success.500" mb={4}>
          <CheckCircle size={48} weight="duotone" style={{ margin: '0 auto' }} />
        </Box>
        <Text fontSize="lg" fontWeight="600" color="brand.800" mb={2}>
          Check your email
        </Text>
        <Text fontSize="sm" color="brand.500" mb={4}>
          We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
        </Text>
        <Text fontSize="xs" color="brand.400">
          Didn't receive it? Check your spam folder.
        </Text>
      </Box>
    );
  }

  return (
    <VStack gap={4} as="form" onSubmit={handleSubmit}>
      <GoogleButton label="Sign up with Google" />

      <Flex align="center" w="100%" gap={3}>
        <Divider />
        <Text fontSize="xs" color="brand.400" whiteSpace="nowrap">
          or sign up with email
        </Text>
        <Divider />
      </Flex>

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
          placeholder="At least 6 characters"
          required
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm" fontWeight="500">Confirm Password</FormLabel>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          required
        />
      </FormControl>

      <Button
        type="submit"
        w="100%"
        isLoading={isLoading}
        loadingText="Creating account..."
      >
        Create Account
      </Button>

      <Text fontSize="xs" color="brand.400" textAlign="center">
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </VStack>
  );
};
