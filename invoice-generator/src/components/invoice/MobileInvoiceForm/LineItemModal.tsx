import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  HStack,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import type { LineItem } from '../../../types/invoice';
import { calculateLineItemAmount } from '../../../utils/currency';
import { validateLineItemInput, type ValidationErrors, getFieldError } from '../../../utils/validation';

interface LineItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: LineItem | null;
  onSave: (item: LineItem) => void;
  isNew?: boolean;
}

export const LineItemModal = ({
  isOpen,
  onClose,
  item,
  onSave,
  isNew = false,
}: LineItemModalProps) => {
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [rateCents, setRateCents] = useState(0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setDescription(item.description);
        setQuantity(item.quantity);
        setRateCents(item.rateCents);
      } else {
        setDescription('');
        setQuantity(1);
        setRateCents(0);
      }
      setErrors({});
      // Auto-focus description field after modal opens
      setTimeout(() => descriptionRef.current?.focus(), 100);
    }
  }, [item, isOpen]);

  const handleSave = () => {
    const result = validateLineItemInput({ description, quantity, rateCents });

    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    const amountCents = calculateLineItemAmount(quantity, rateCents);
    onSave({
      id: item?.id || crypto.randomUUID(),
      description,
      quantity,
      rateCents,
      amountCents,
    });
    onClose();
  };

  const rateValue = rateCents / 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent m={0} borderRadius={0}>
        <ModalHeader borderBottom="1px solid" borderColor="brand.100">
          {isNew ? 'Add Line Item' : 'Edit Line Item'}
        </ModalHeader>
        <ModalBody py={6}>
          <VStack spacing={5} align="stretch">
            <FormControl isInvalid={!!getFieldError(errors, 'description')}>
              <FormLabel>Description</FormLabel>
              <Textarea
                ref={descriptionRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Service or product description"
                rows={3}
                size="lg"
              />
              <FormErrorMessage>{getFieldError(errors, 'description')}</FormErrorMessage>
            </FormControl>

            <HStack spacing={4}>
              <FormControl flex={1} isInvalid={!!getFieldError(errors, 'quantity')}>
                <FormLabel>Quantity</FormLabel>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  min={0}
                  step={1}
                  size="lg"
                />
                <FormErrorMessage>{getFieldError(errors, 'quantity')}</FormErrorMessage>
              </FormControl>

              <FormControl flex={1} isInvalid={!!getFieldError(errors, 'rateCents')}>
                <FormLabel>Rate</FormLabel>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={rateValue || ''}
                  onChange={(e) => setRateCents(Math.round((parseFloat(e.target.value) || 0) * 100))}
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  size="lg"
                />
                <FormErrorMessage>{getFieldError(errors, 'rateCents')}</FormErrorMessage>
              </FormControl>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter borderTop="1px solid" borderColor="brand.100" gap={3}>
          <Button variant="ghost" onClick={onClose} flex={1}>
            Cancel
          </Button>
          <Button colorScheme="accent" onClick={handleSave} flex={1}>
            {isNew ? 'Add Item' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
