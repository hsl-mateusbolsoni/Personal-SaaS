import { Box, Flex, Text, IconButton, useDisclosure } from '@chakra-ui/react';
import { Trash, PencilSimple } from 'phosphor-react';
import { useClientStore } from '../../stores/useClientStore';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { EmptyState } from '../ui/EmptyState';
import { formatDate } from '../../utils/formatting';
import { useState } from 'react';

export const ClientList = ({
  onEdit,
}: {
  onEdit: (id: string) => void;
}) => {
  const clients = useClientStore((s) => s.clients);
  const deleteClient = useClientStore((s) => s.deleteClient);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState('');

  if (clients.length === 0) {
    return <EmptyState title="No clients yet" description="Add your first client to get started." />;
  }

  return (
    <>
      <Box>
        {clients.map((client) => (
          <Flex
            key={client.id}
            align="center"
            justify="space-between"
            py={4}
            px={6}
            borderBottom="1px solid"
            borderColor="brand.100"
            _hover={{ bg: 'brand.50' }}
            _last={{ borderBottom: 'none' }}
          >
            <Box>
              <Text fontSize="sm" fontWeight="600" color="brand.800">{client.name}</Text>
              <Text fontSize="sm" color="brand.500">{client.email}</Text>
            </Box>
            <Flex align="center" gap={3}>
              <Text fontSize="sm" color="brand.400">
                {formatDate(client.createdAt)}
              </Text>
              <IconButton
                aria-label="Edit"
                icon={<PencilSimple size={14} />}
                variant="ghost"
                size="xs"
                onClick={() => onEdit(client.id)}
              />
              <IconButton
                aria-label="Delete"
                icon={<Trash size={14} />}
                variant="ghost"
                size="xs"
                colorScheme="red"
                onClick={() => { setDeleteId(client.id); onOpen(); }}
              />
            </Flex>
          </Flex>
        ))}
      </Box>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => deleteClient(deleteId)}
        title="Delete Client"
        message="Are you sure? This cannot be undone."
      />
    </>
  );
};
