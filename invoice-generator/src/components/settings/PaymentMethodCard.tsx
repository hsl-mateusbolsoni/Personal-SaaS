import { Box, Flex, Text, IconButton, Badge, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { DotsThree, Bank, QrCode, CurrencyDollar, CurrencyCircleDollar, CurrencyBtc, Wallet, Star } from 'phosphor-react';
import type { PaymentMethod, PaymentType } from '../../types/payment';
import { PAYMENT_TYPE_LABELS, getPaymentMethodSummary } from '../../types/payment';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

const getIcon = (type: PaymentType) => {
  const props = { size: 20, weight: 'duotone' as const };
  switch (type) {
    case 'bank_transfer':
      return <Bank {...props} />;
    case 'pix':
      return <QrCode {...props} />;
    case 'paypal':
      return <CurrencyDollar {...props} />;
    case 'wise':
      return <CurrencyCircleDollar {...props} />;
    case 'crypto':
      return <CurrencyBtc {...props} />;
    case 'other':
      return <Wallet {...props} />;
    default:
      return <Wallet {...props} />;
  }
};

export const PaymentMethodCard = ({
  method,
  onEdit,
  onDelete,
  onSetDefault,
}: PaymentMethodCardProps) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      p={4}
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor={method.isDefault ? 'accent.200' : 'brand.100'}
      transition="all 0.15s"
      _hover={{ borderColor: 'brand.200', shadow: 'sm' }}
    >
      <Flex align="center" gap={3}>
        <Box
          p={2}
          borderRadius="lg"
          bg={method.isDefault ? 'accent.50' : 'brand.50'}
          color={method.isDefault ? 'accent.500' : 'brand.500'}
        >
          {getIcon(method.type)}
        </Box>
        <Box>
          <Flex align="center" gap={2}>
            <Text fontSize="sm" fontWeight="600" color="brand.800">
              {PAYMENT_TYPE_LABELS[method.type]}
            </Text>
            {method.isDefault && (
              <Badge
                colorScheme="purple"
                fontSize="10px"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Star size={10} weight="fill" />
                Default
              </Badge>
            )}
          </Flex>
          <Text fontSize="sm" color="brand.500">
            {getPaymentMethodSummary(method)}
          </Text>
        </Box>
      </Flex>

      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Actions"
          icon={<DotsThree size={20} weight="bold" />}
          variant="ghost"
          size="sm"
        />
        <MenuList>
          <MenuItem onClick={onEdit}>Edit</MenuItem>
          {!method.isDefault && (
            <MenuItem onClick={onSetDefault}>Set as Default</MenuItem>
          )}
          <MenuItem color="danger.500" onClick={onDelete}>
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
