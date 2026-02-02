import { Box, Flex, Text, Button, useDisclosure } from '@chakra-ui/react';
import { Plus } from 'phosphor-react';
import { useState } from 'react';
import { Container } from '../components/layout/Container';
import { ClientList } from '../components/client/ClientList';
import { ClientForm } from '../components/client/ClientForm';
import { useClientStore } from '../stores/useClientStore';
import { clientService } from '../services';
import { useToast } from '@chakra-ui/react';

export const Clients = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editId, setEditId] = useState<string | null>(null);
  const clients = useClientStore((s) => s.clients);
  const editClient = clients.find((c) => c.id === editId);

  const handleSubmit = async (data: { name: string; email: string; phone: string; address: string }) => {
    if (editId) {
      await clientService.updateClient(editId, data);
      toast({ title: 'Client updated', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
    } else {
      await clientService.createClient(data);
      toast({ title: 'Client added', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
    }
    setEditId(null);
    onClose();
  };

  const handleEdit = (id: string) => {
    setEditId(id);
    onOpen();
  };

  return (
    <Container>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="md" fontWeight="700">Clients</Text>
        <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => { setEditId(null); onOpen(); }}>
          Add Client
        </Button>
      </Flex>

      {isOpen && (
        <Box bg="white" p={6} borderRadius="md" border="1px solid" borderColor="gray.200" mb={6}>
          <Text fontSize="sm" fontWeight="600" mb={4}>{editId ? 'Edit' : 'New'} Client</Text>
          <ClientForm
            initial={editClient}
            onSubmit={handleSubmit}
            onCancel={() => { setEditId(null); onClose(); }}
          />
        </Box>
      )}

      <Box bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
        <ClientList onEdit={handleEdit} />
      </Box>
    </Container>
  );
};
