import { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  Text,
  Box,
} from '@chakra-ui/react';
import { FloppyDisk } from 'phosphor-react';
import type {
  PaymentMethod,
  PaymentType,
  BankTransferDetails,
  PixDetails,
  PaypalDetails,
  WiseDetails,
  CryptoDetails,
  OtherDetails,
} from '../../types/payment';
import { PAYMENT_TYPE_LABELS } from '../../types/payment';

interface PaymentMethodDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  method?: PaymentMethod | null;
  onSave: (method: PaymentMethod) => void;
}

const DEFAULT_BANK_TRANSFER: BankTransferDetails = {
  bankName: '',
  accountName: '',
  accountNumber: '',
  routingNumber: '',
  swiftBic: '',
  iban: '',
};

const DEFAULT_PIX: PixDetails = {
  pixKey: '',
  pixKeyType: 'email',
  recipientName: '',
};

const DEFAULT_PAYPAL: PaypalDetails = {
  email: '',
};

const DEFAULT_WISE: WiseDetails = {
  email: '',
};

const DEFAULT_CRYPTO: CryptoDetails = {
  walletAddress: '',
  network: '',
  currency: '',
};

const DEFAULT_OTHER: OtherDetails = {
  label: '',
  instructions: '',
};

export const PaymentMethodDrawer = ({
  isOpen,
  onClose,
  method,
  onSave,
}: PaymentMethodDrawerProps) => {
  const [type, setType] = useState<PaymentType>('bank_transfer');
  const [bankTransfer, setBankTransfer] = useState<BankTransferDetails>(DEFAULT_BANK_TRANSFER);
  const [pix, setPix] = useState<PixDetails>(DEFAULT_PIX);
  const [paypal, setPaypal] = useState<PaypalDetails>(DEFAULT_PAYPAL);
  const [wise, setWise] = useState<WiseDetails>(DEFAULT_WISE);
  const [cryptoDetails, setCryptoDetails] = useState<CryptoDetails>(DEFAULT_CRYPTO);
  const [other, setOther] = useState<OtherDetails>(DEFAULT_OTHER);

  const isEditing = !!method;

  useEffect(() => {
    if (isOpen) {
      if (method) {
        setType(method.type);
        setBankTransfer(method.bankTransfer || DEFAULT_BANK_TRANSFER);
        setPix(method.pix || DEFAULT_PIX);
        setPaypal(method.paypal || DEFAULT_PAYPAL);
        setWise(method.wise || DEFAULT_WISE);
        setCryptoDetails(method.crypto || DEFAULT_CRYPTO);
        setOther(method.other || DEFAULT_OTHER);
      } else {
        setType('bank_transfer');
        setBankTransfer(DEFAULT_BANK_TRANSFER);
        setPix(DEFAULT_PIX);
        setPaypal(DEFAULT_PAYPAL);
        setWise(DEFAULT_WISE);
        setCryptoDetails(DEFAULT_CRYPTO);
        setOther(DEFAULT_OTHER);
      }
    }
  }, [isOpen, method]);

  const handleSave = () => {
    const newMethod: PaymentMethod = {
      id: method?.id || crypto.randomUUID(),
      type,
      isDefault: method?.isDefault || false,
    };

    switch (type) {
      case 'bank_transfer':
        newMethod.bankTransfer = bankTransfer;
        break;
      case 'pix':
        newMethod.pix = pix;
        break;
      case 'paypal':
        newMethod.paypal = paypal;
        break;
      case 'wise':
        newMethod.wise = wise;
        break;
      case 'crypto':
        newMethod.crypto = cryptoDetails;
        break;
      case 'other':
        newMethod.other = other;
        break;
    }

    onSave(newMethod);
    onClose();
  };

  const renderTypeSpecificFields = () => {
    switch (type) {
      case 'bank_transfer':
        return (
          <>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Bank Name</FormLabel>
              <Input
                value={bankTransfer.bankName}
                onChange={(e) => setBankTransfer({ ...bankTransfer, bankName: e.target.value })}
                placeholder="e.g. Chase Bank"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Account Holder Name</FormLabel>
              <Input
                value={bankTransfer.accountName}
                onChange={(e) => setBankTransfer({ ...bankTransfer, accountName: e.target.value })}
                placeholder="Your Company LLC"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Account Number</FormLabel>
              <Input
                value={bankTransfer.accountNumber}
                onChange={(e) => setBankTransfer({ ...bankTransfer, accountNumber: e.target.value })}
                placeholder="1234567890"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Routing / Sort Code</FormLabel>
              <Input
                value={bankTransfer.routingNumber}
                onChange={(e) => setBankTransfer({ ...bankTransfer, routingNumber: e.target.value })}
                placeholder="021000021"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">SWIFT / BIC</FormLabel>
              <Input
                value={bankTransfer.swiftBic}
                onChange={(e) => setBankTransfer({ ...bankTransfer, swiftBic: e.target.value })}
                placeholder="CHASUS33"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">IBAN</FormLabel>
              <Input
                value={bankTransfer.iban}
                onChange={(e) => setBankTransfer({ ...bankTransfer, iban: e.target.value })}
                placeholder="GB82 WEST 1234 5698 7654 32"
              />
            </FormControl>
          </>
        );

      case 'pix':
        return (
          <>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">PIX Key Type</FormLabel>
              <Select
                value={pix.pixKeyType}
                onChange={(e) => setPix({ ...pix, pixKeyType: e.target.value as PixDetails['pixKeyType'] })}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
                <option value="random">Random Key</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">PIX Key</FormLabel>
              <Input
                value={pix.pixKey}
                onChange={(e) => setPix({ ...pix, pixKey: e.target.value })}
                placeholder="your@email.com"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Recipient Name</FormLabel>
              <Input
                value={pix.recipientName}
                onChange={(e) => setPix({ ...pix, recipientName: e.target.value })}
                placeholder="Your Company LLC"
              />
            </FormControl>
          </>
        );

      case 'paypal':
        return (
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500">PayPal Email</FormLabel>
            <Input
              type="email"
              value={paypal.email}
              onChange={(e) => setPaypal({ ...paypal, email: e.target.value })}
              placeholder="payments@company.com"
            />
          </FormControl>
        );

      case 'wise':
        return (
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500">Wise Email</FormLabel>
            <Input
              type="email"
              value={wise.email}
              onChange={(e) => setWise({ ...wise, email: e.target.value })}
              placeholder="payments@company.com"
            />
          </FormControl>
        );

      case 'crypto':
        return (
          <>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Currency</FormLabel>
              <Input
                value={cryptoDetails.currency}
                onChange={(e) => setCryptoDetails({ ...cryptoDetails, currency: e.target.value })}
                placeholder="e.g. BTC, ETH, USDT"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Network</FormLabel>
              <Input
                value={cryptoDetails.network}
                onChange={(e) => setCryptoDetails({ ...cryptoDetails, network: e.target.value })}
                placeholder="e.g. Bitcoin, Ethereum, Polygon"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Wallet Address</FormLabel>
              <Input
                value={cryptoDetails.walletAddress}
                onChange={(e) => setCryptoDetails({ ...cryptoDetails, walletAddress: e.target.value })}
                placeholder="0x..."
              />
            </FormControl>
          </>
        );

      case 'other':
        return (
          <>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Label</FormLabel>
              <Input
                value={other.label}
                onChange={(e) => setOther({ ...other, label: e.target.value })}
                placeholder="e.g. Check, Cash, Venmo"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Payment Instructions</FormLabel>
              <Textarea
                rows={4}
                value={other.instructions}
                onChange={(e) => setOther({ ...other, instructions: e.target.value })}
                placeholder="Provide payment instructions for your clients..."
              />
            </FormControl>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px" borderColor="brand.100">
          {isEditing ? 'Edit Payment Method' : 'Add Payment Method'}
        </DrawerHeader>

        <DrawerBody py={6}>
          <VStack gap={4} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Payment Type</FormLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as PaymentType)}
                isDisabled={isEditing}
              >
                {Object.entries(PAYMENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
              {isEditing && (
                <Text fontSize="xs" color="brand.400" mt={1}>
                  Payment type cannot be changed. Delete and create a new one instead.
                </Text>
              )}
            </FormControl>

            <Box h={2} />

            {renderTypeSpecificFields()}
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px" borderColor="brand.100">
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button leftIcon={<FloppyDisk size={16} />} onClick={handleSave}>
            {isEditing ? 'Save Changes' : 'Add Method'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
