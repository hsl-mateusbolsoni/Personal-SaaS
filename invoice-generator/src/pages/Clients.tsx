import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { Plus } from 'phosphor-react';
import { useState } from 'react';
import { Container } from '../components/layout/Container';
import { PageHeader } from '../components/layout/PageHeader';
import { ClientList } from '../components/client/ClientList';
import { ClientDrawer } from '../components/client/ClientDrawer';
import { useClientStore } from '../stores/useClientStore';
import { clientService } from '../services';
import { toast } from '../utils/toast';

export const Clients = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editId, setEditId] = useState<string | null>(null);
  const clients = useClientStore((s) => s.clients);
  const editClient = clients.find((c) => c.id === editId) || null;

  const handleSubmit = async (data: { name: string; email: string; phone: string; address: string }) => {
    if (editId) {
      await clientService.updateClient(editId, data);
      toast.success({ title: 'Client updated' });
    } else {
      await clientService.createClient(data);
      toast.success({ title: 'Client added' });
    }
    setEditId(null);
    onClose();
  };

  const handleEdit = (id: string) => {
    setEditId(id);
    onOpen();
  };

  const handleClose = () => {
    setEditId(null);
    onClose();
  };

  return (
    <Container>
      <PageHeader
        title="Clients"
        subtitle="Manage your client contacts"
        actions={
          <Button size="sm" leftIcon={<Plus size={14} weight="bold" />} onClick={() => { setEditId(null); onOpen(); }}>
            Add Client
          </Button>
        }
      />

      <Box bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="brand.100" overflow="hidden">
        <ClientList onEdit={handleEdit} />
      </Box>

      <ClientDrawer
        isOpen={isOpen}
        onClose={handleClose}
        client={editClient}
        onSubmit={handleSubmit}
      />
    </Container>
  );
};
