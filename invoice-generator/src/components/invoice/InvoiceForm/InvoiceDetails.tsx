import { SimpleGrid, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { CurrencySelect } from '../../ui/CurrencySelect';
import type { CurrencyCode } from '../../../types/currency';

interface Props {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  currency: CurrencyCode;
  onChangeNumber: (v: string) => void;
  onChangeDate: (v: string) => void;
  onChangeDueDate: (v: string) => void;
  onChangeCurrency: (v: CurrencyCode) => void;
}

export const InvoiceDetails = ({
  invoiceNumber, date, dueDate, currency,
  onChangeNumber, onChangeDate, onChangeDueDate, onChangeCurrency,
}: Props) => (
  <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
    <FormControl>
      <FormLabel fontSize="xs">Invoice Number</FormLabel>
      <Input size="sm" value={invoiceNumber} onChange={(e) => onChangeNumber(e.target.value)} />
    </FormControl>
    <FormControl>
      <FormLabel fontSize="xs">Currency</FormLabel>
      <CurrencySelect value={currency} onChange={onChangeCurrency} />
    </FormControl>
    <FormControl>
      <FormLabel fontSize="xs">Invoice Date</FormLabel>
      <Input size="sm" type="date" value={date} onChange={(e) => onChangeDate(e.target.value)} />
    </FormControl>
    <FormControl>
      <FormLabel fontSize="xs">Due Date</FormLabel>
      <Input size="sm" type="date" value={dueDate} onChange={(e) => onChangeDueDate(e.target.value)} />
    </FormControl>
  </SimpleGrid>
);
