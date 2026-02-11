import { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Alert,
  AlertIcon,
  Box,
} from '@chakra-ui/react';
import { ArrowLeft, CheckCircle } from 'phosphor-react';
import { useAuth } from '../../contexts/AuthContext';

interface ForgotPasswordProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setShowSuccess(true);
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <Box textAlign="center" py={4}>
        <Box color="success.500" mb={4}>
          <CheckCircle size={48} weight="duotone" style={{ margin: '0 auto' }} />
        </Box>
        <Text fontSize="lg" fontWeight="600" color="brand.800" mb={2}>
          Check your email
        </Text>
        <Text fontSize="sm" color="brand.500" mb={4}>
          We sent a password reset link to <strong>{email}</strong>.
        </Text>
        <Button variant="ghost" onClick={onBack} leftIcon={<ArrowLeft size={16} />}>
          Back to login
        </Button>
      </Box>
    );
  }

  return (
    <VStack gap={4} as="form" onSubmit={handleSubmit}>
      <Text fontSize="sm" color="brand.500" textAlign="center">
        Enter your email address and we'll send you a link to reset your password.
      </Text>

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

      <Button
        type="submit"
        w="100%"
        isLoading={isLoading}
        loadingText="Sending..."
      >
        Send Reset Link
      </Button>

      <Button variant="ghost" onClick={onBack} leftIcon={<ArrowLeft size={16} />}>
        Back to login
      </Button>
    </VStack>
  );
};
