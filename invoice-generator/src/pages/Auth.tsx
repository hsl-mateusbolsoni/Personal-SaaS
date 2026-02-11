import { useState } from 'react';
import { Box, Flex, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { Receipt } from 'phosphor-react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { ForgotPassword } from '../components/auth/ForgotPassword';

type View = 'login' | 'signup' | 'forgot';

export const Auth = () => {
  const [view, setView] = useState<View>('login');
  const [tabIndex, setTabIndex] = useState(0);

  const handleForgotPassword = () => setView('forgot');
  const handleBackToLogin = () => {
    setView('login');
    setTabIndex(0);
  };

  return (
    <Flex minH="100vh" bg="brand.50">
      {/* Left side - Branding */}
      <Flex
        display={{ base: 'none', lg: 'flex' }}
        flex={1}
        bg="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
        direction="column"
        justify="center"
        align="center"
        p={12}
        color="white"
      >
        <Receipt size={64} weight="duotone" />
        <Text fontSize="3xl" fontWeight="700" mt={4}>
          Invoicer
        </Text>
        <Text fontSize="lg" mt={2} opacity={0.9} textAlign="center" maxW="400px">
          Create professional invoices in minutes. Track payments, manage clients, and grow your business.
        </Text>
      </Flex>

      {/* Right side - Auth forms */}
      <Flex flex={1} justify="center" align="center" p={8}>
        <Box
          w="100%"
          maxW="420px"
          bg="white"
          p={8}
          borderRadius="2xl"
          shadow="xl"
          border="1px solid"
          borderColor="brand.100"
        >
          {/* Mobile logo */}
          <Flex display={{ base: 'flex', lg: 'none' }} align="center" justify="center" gap={2} mb={6}>
            <Receipt size={28} weight="duotone" color="#6366f1" />
            <Text fontSize="xl" fontWeight="700" color="brand.800">
              Invoicer
            </Text>
          </Flex>

          {view === 'forgot' ? (
            <>
              <Text fontSize="xl" fontWeight="600" color="brand.800" mb={1}>
                Reset Password
              </Text>
              <Text fontSize="sm" color="brand.500" mb={6}>
                We'll send you a link to reset your password
              </Text>
              <ForgotPassword onBack={handleBackToLogin} onSuccess={handleBackToLogin} />
            </>
          ) : (
            <>
              <Text fontSize="xl" fontWeight="600" color="brand.800" mb={1}>
                Welcome
              </Text>
              <Text fontSize="sm" color="brand.500" mb={6}>
                Sign in to your account or create a new one
              </Text>

              <Tabs
                index={tabIndex}
                onChange={(index) => {
                  setTabIndex(index);
                  setView(index === 0 ? 'login' : 'signup');
                }}
                variant="soft-rounded"
                colorScheme="purple"
              >
                <TabList bg="brand.50" p={1} borderRadius="lg" mb={6}>
                  <Tab flex={1} fontSize="sm" fontWeight="500">Sign In</Tab>
                  <Tab flex={1} fontSize="sm" fontWeight="500">Sign Up</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel p={0}>
                    <LoginForm
                      onForgotPassword={handleForgotPassword}
                      onSuccess={() => {}}
                    />
                  </TabPanel>
                  <TabPanel p={0}>
                    <SignupForm onSuccess={() => {}} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};
