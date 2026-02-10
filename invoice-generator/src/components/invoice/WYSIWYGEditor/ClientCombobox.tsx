import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  List,
  ListItem,
  Text,
  Flex,
  Kbd,
  useToken,
} from '@chakra-ui/react';
import { MagnifyingGlass, User, Plus } from 'phosphor-react';
import type { Client } from '../../../types/client';

interface ClientComboboxProps {
  clients: Client[];
  onSelect: (client: Client | null) => void;
  onCreateNew?: () => void;
}

export const ClientCombobox = ({ clients, onSelect, onCreateNew }: ClientComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [iconColor] = useToken('colors', ['brand.400']);

  const filtered = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = filtered.length + (onCreateNew ? 1 : 0);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  const handleSelect = (client: Client) => {
    onSelect(client);
    setSearch('');
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
      setSearch('');
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex < filtered.length) {
          handleSelect(filtered[highlightedIndex]);
        } else if (onCreateNew) {
          handleCreateNew();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearch('');
        break;
    }
  };

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom-start"
      autoFocus={false}
      matchWidth
    >
      <PopoverTrigger>
        <InputGroup size="xs">
          <InputLeftElement pointerEvents="none">
            <MagnifyingGlass size={12} color={iconColor} />
          </InputLeftElement>
          <Input
            ref={inputRef}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search clients..."
            fontSize="7pt"
            bg="white"
            borderColor="brand.200"
            _hover={{ borderColor: 'brand.300' }}
            _focus={{ borderColor: 'accent.500', boxShadow: '0 0 0 1px var(--chakra-colors-accent-500)' }}
          />
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent
        width="220px"
        shadow="lg"
        border="1px solid"
        borderColor="brand.100"
        _focus={{ outline: 'none' }}
      >
        <PopoverBody p={1}>
          {filtered.length === 0 && !onCreateNew ? (
            <Text fontSize="xs" color="brand.500" p={2} textAlign="center">
              No clients found
            </Text>
          ) : (
            <List spacing={0}>
              {filtered.map((client, index) => (
                <ListItem
                  key={client.id}
                  px={2}
                  py={1.5}
                  cursor="pointer"
                  borderRadius="md"
                  bg={highlightedIndex === index ? 'accent.50' : 'transparent'}
                  _hover={{ bg: 'brand.50' }}
                  onClick={() => handleSelect(client)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <Flex align="center" gap={2}>
                    <Box
                      p={1}
                      borderRadius="full"
                      bg={highlightedIndex === index ? 'accent.100' : 'brand.100'}
                    >
                      <User size={10} weight="bold" />
                    </Box>
                    <Box flex={1} minW={0}>
                      <Text fontSize="xs" fontWeight="500" color="brand.800" noOfLines={1}>
                        {client.name}
                      </Text>
                      <Text fontSize="10px" color="brand.500" noOfLines={1}>
                        {client.email}
                      </Text>
                    </Box>
                  </Flex>
                </ListItem>
              ))}
              {onCreateNew && (
                <ListItem
                  px={2}
                  py={1.5}
                  cursor="pointer"
                  borderRadius="md"
                  bg={highlightedIndex === filtered.length ? 'accent.50' : 'transparent'}
                  borderTop={filtered.length > 0 ? '1px solid' : 'none'}
                  borderColor="brand.100"
                  mt={filtered.length > 0 ? 1 : 0}
                  _hover={{ bg: 'brand.50' }}
                  onClick={handleCreateNew}
                  onMouseEnter={() => setHighlightedIndex(filtered.length)}
                >
                  <Flex align="center" gap={2}>
                    <Box p={1} borderRadius="full" bg="green.100">
                      <Plus size={10} weight="bold" color="#16a34a" />
                    </Box>
                    <Text fontSize="xs" fontWeight="500" color="green.600">
                      Add new client
                    </Text>
                  </Flex>
                </ListItem>
              )}
            </List>
          )}
          {isOpen && filtered.length > 0 && (
            <Flex justify="center" gap={1} pt={1} borderTop="1px solid" borderColor="brand.100" mt={1}>
              <Kbd fontSize="9px">↑↓</Kbd>
              <Text fontSize="9px" color="brand.400">navigate</Text>
              <Kbd fontSize="9px" ml={1}>↵</Kbd>
              <Text fontSize="9px" color="brand.400">select</Text>
            </Flex>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
