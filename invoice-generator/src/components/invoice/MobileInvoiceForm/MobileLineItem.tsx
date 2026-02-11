import { Box, Flex, Text, IconButton, HStack } from '@chakra-ui/react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { PencilSimple, Trash } from 'phosphor-react';
import { useState } from 'react';
import type { LineItem } from '../../../types/invoice';
import type { CurrencyCode } from '../../../types/currency';
import { formatCurrency } from '../../../utils/currency';

const MotionBox = motion(Box);

interface MobileLineItemProps {
  item: LineItem;
  currency: CurrencyCode;
  onEdit: () => void;
  onDelete: () => void;
}

export const MobileLineItem = ({
  item,
  currency,
  onEdit,
  onDelete,
}: MobileLineItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);
  const deleteScale = useTransform(x, [-100, -50, 0], [1, 0.9, 0.8]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -80) {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete();
      }, 200);
    }
  };

  return (
    <Box position="relative" overflow="hidden" borderRadius="lg">
      {/* Delete background */}
      <Flex
        position="absolute"
        right={0}
        top={0}
        bottom={0}
        w="100px"
        bg="danger.500"
        borderRadius="lg"
        align="center"
        justify="center"
        style={{ opacity: deleteOpacity.get(), scale: deleteScale.get() }}
      >
        <MotionBox style={{ opacity: deleteOpacity, scale: deleteScale }}>
          <Trash size={24} color="white" weight="bold" />
        </MotionBox>
      </Flex>

      {/* Swipeable content */}
      <MotionBox
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={isDeleting ? { x: -300, opacity: 0 } : {}}
        transition={{ duration: 0.2 }}
        bg="white"
        borderRadius="lg"
        border="1px solid"
        borderColor="brand.100"
        p={4}
        cursor="grab"
        _active={{ cursor: 'grabbing' }}
      >
        <Flex justify="space-between" align="flex-start" gap={3}>
          <Box flex={1} onClick={onEdit} cursor="pointer">
            <Text fontWeight="500" fontSize="sm" noOfLines={2} mb={2}>
              {item.description || 'No description'}
            </Text>
            <HStack spacing={2} color="brand.500" fontSize="sm">
              <Text>{item.quantity} × {formatCurrency(item.rateCents, currency)}</Text>
              <Text>=</Text>
              <Text fontWeight="600" color="brand.700">
                {formatCurrency(item.amountCents, currency)}
              </Text>
            </HStack>
          </Box>
          <HStack spacing={1}>
            <IconButton
              aria-label="Edit item"
              icon={<PencilSimple size={18} />}
              size="sm"
              variant="ghost"
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
            />
            <IconButton
              aria-label="Delete item"
              icon={<Trash size={18} />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
            />
          </HStack>
        </Flex>
      </MotionBox>
    </Box>
  );
};
