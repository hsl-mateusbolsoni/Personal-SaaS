import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Flex,
} from '@chakra-ui/react';
import {
  FileText,
  PencilSimple,
  PaperPlaneTilt,
  CheckCircle,
  Warning,
  Eye,
  DownloadSimple,
  Copy,
} from 'phosphor-react';
import { Timeline, TimelineItem } from '../ui/Timeline';
import { useActivityStore } from '../../stores/useActivityStore';
import { ACTIVITY_LABELS, type ActivityType } from '../../types/activity';
import { formatDistanceToNow, format } from 'date-fns';

interface ActivityLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  invoiceNumber: string;
}

const getActivityIcon = (type: ActivityType) => {
  const iconProps = { size: 16, weight: 'bold' as const };

  switch (type) {
    case 'created':
      return <FileText {...iconProps} />;
    case 'updated':
      return <PencilSimple {...iconProps} />;
    case 'sent':
      return <PaperPlaneTilt {...iconProps} />;
    case 'paid':
      return <CheckCircle {...iconProps} />;
    case 'overdue':
      return <Warning {...iconProps} />;
    case 'viewed':
      return <Eye {...iconProps} />;
    case 'downloaded':
      return <DownloadSimple {...iconProps} />;
    case 'duplicated':
      return <Copy {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};

const getActivityColors = (type: ActivityType): { bg: string; color: string } => {
  switch (type) {
    case 'created':
      return { bg: 'accent.100', color: 'accent.600' };
    case 'paid':
      return { bg: 'success.100', color: 'success.600' };
    case 'sent':
      return { bg: 'accent.100', color: 'accent.600' };
    case 'overdue':
      return { bg: 'danger.100', color: 'danger.600' };
    case 'updated':
      return { bg: 'brand.100', color: 'brand.600' };
    case 'downloaded':
      return { bg: 'brand.100', color: 'brand.600' };
    case 'viewed':
      return { bg: 'brand.100', color: 'brand.600' };
    case 'duplicated':
      return { bg: 'brand.100', color: 'brand.600' };
    default:
      return { bg: 'brand.100', color: 'brand.600' };
  }
};

const formatTimestamp = (dateStr: string) => {
  const date = new Date(dateStr);
  const relative = formatDistanceToNow(date, { addSuffix: true });
  const absolute = format(date, 'MMM d, yyyy · h:mm a');
  return `${relative} · ${absolute}`;
};

export const ActivityLogDrawer = ({
  isOpen,
  onClose,
  invoiceId,
  invoiceNumber,
}: ActivityLogDrawerProps) => {
  const allActivities = useActivityStore((s) => s.activities);
  const activities = allActivities
    .filter((a) => a.invoiceId === invoiceId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px" borderColor="brand.100">
          <Text fontSize="lg" fontWeight="600" color="brand.800">
            Activity Log
          </Text>
          <Text fontSize="sm" fontWeight="400" color="brand.500">
            {invoiceNumber}
          </Text>
        </DrawerHeader>

        <DrawerBody py={6}>
          {activities.length === 0 ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              py={12}
              color="brand.400"
            >
              <FileText size={48} weight="duotone" />
              <Text mt={4} fontSize="sm">
                No activity recorded yet
              </Text>
            </Flex>
          ) : (
            <Timeline>
              {activities.map((activity, index) => {
                const colors = getActivityColors(activity.type);
                return (
                  <TimelineItem
                    key={activity.id}
                    icon={getActivityIcon(activity.type)}
                    title={ACTIVITY_LABELS[activity.type]}
                    description={activity.description}
                    timestamp={formatTimestamp(activity.createdAt)}
                    isLast={index === activities.length - 1}
                    iconBg={colors.bg}
                    iconColor={colors.color}
                  />
                );
              })}
            </Timeline>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
