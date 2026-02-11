import {
  Box,
  HStack,
  Text,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverHeader,
  VStack,
  Button,
  Badge,
} from '@chakra-ui/react';
import { CloudCheck, CloudSlash, Warning, ArrowClockwise, X } from 'phosphor-react';
import { useSyncStore } from '../../stores/useSyncStore';
import { formatDistanceToNow } from 'date-fns';

export const SyncStatusIndicator = () => {
  const { isOnline, isSyncing, lastSyncAt, errors, clearError, clearAllErrors } = useSyncStore();

  const hasErrors = errors.length > 0;

  const getStatusIcon = () => {
    if (!isOnline) return CloudSlash;
    if (hasErrors) return Warning;
    if (isSyncing) return ArrowClockwise;
    return CloudCheck;
  };

  const getStatusColor = () => {
    if (!isOnline) return 'brand.400';
    if (hasErrors) return 'warning.500';
    if (isSyncing) return 'accent.500';
    return 'success.500';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (hasErrors) return `${errors.length} sync error${errors.length > 1 ? 's' : ''}`;
    if (isSyncing) return 'Syncing...';
    if (lastSyncAt) return `Synced ${formatDistanceToNow(new Date(lastSyncAt), { addSuffix: true })}`;
    return 'Saved locally';
  };

  const StatusIcon = getStatusIcon();

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <HStack
          spacing={2}
          px={3}
          py={1.5}
          bg={hasErrors ? 'warning.50' : !isOnline ? 'brand.100' : 'transparent'}
          borderRadius="md"
          cursor="pointer"
          _hover={{ bg: hasErrors ? 'warning.100' : 'brand.100' }}
          transition="all 0.15s"
        >
          <Icon
            as={StatusIcon}
            boxSize={4}
            color={getStatusColor()}
            className={isSyncing ? 'spin' : undefined}
          />
          <Text fontSize="xs" color={hasErrors ? 'warning.700' : 'brand.500'} fontWeight="500">
            {getStatusText()}
          </Text>
          {hasErrors && (
            <Badge colorScheme="orange" size="sm" borderRadius="full">
              {errors.length}
            </Badge>
          )}
        </HStack>
      </PopoverTrigger>
      <PopoverContent w="320px">
        <PopoverHeader fontWeight="600" fontSize="sm" borderBottom="1px solid" borderColor="brand.100">
          <HStack justify="space-between">
            <Text>Sync Status</Text>
            {!isOnline && (
              <Badge colorScheme="gray">Offline</Badge>
            )}
          </HStack>
        </PopoverHeader>
        <PopoverBody>
          <VStack align="stretch" spacing={3}>
            {!isOnline && (
              <Box bg="brand.50" p={3} borderRadius="md">
                <Text fontSize="sm" color="brand.600">
                  You're offline. Changes are saved locally and will sync when you reconnect.
                </Text>
              </Box>
            )}

            {hasErrors ? (
              <>
                <VStack align="stretch" spacing={2} maxH="200px" overflowY="auto">
                  {errors.map((error) => (
                    <HStack
                      key={error.id}
                      bg="warning.50"
                      p={2}
                      borderRadius="md"
                      justify="space-between"
                    >
                      <Box flex={1}>
                        <Text fontSize="xs" fontWeight="500" color="warning.700">
                          {error.type} {error.operation} failed
                        </Text>
                        <Text fontSize="xs" color="warning.600">
                          {error.message}
                        </Text>
                      </Box>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="orange"
                        onClick={() => clearError(error.id)}
                        minW="auto"
                        p={1}
                      >
                        <X size={14} />
                      </Button>
                    </HStack>
                  ))}
                </VStack>
                <Button size="sm" variant="outline" onClick={clearAllErrors}>
                  Clear all errors
                </Button>
              </>
            ) : (
              <Box textAlign="center" py={2}>
                <Icon as={CloudCheck} boxSize={8} color="success.500" mb={2} />
                <Text fontSize="sm" color="brand.600">
                  {isOnline ? 'All changes synced' : 'Changes saved locally'}
                </Text>
                {lastSyncAt && (
                  <Text fontSize="xs" color="brand.400">
                    Last sync: {formatDistanceToNow(new Date(lastSyncAt), { addSuffix: true })}
                  </Text>
                )}
              </Box>
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
