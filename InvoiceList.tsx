// Updated sorting logic
const sortedInvoices = invoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());