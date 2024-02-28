// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  _id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  _id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  _id: string;
  customer_id: {
    _id: string,
    name: string,
    email: string,
    image_url: string
},
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type InvoicesTableFormatted = {
  _id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  _id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  _id: string;
  name: string;
};

export type CustomerForm = {
  name: string;
  email: string;
  image_url: string;
};

export type InvoiceForm = {
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
  status?: string;
};


export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    image_url?: string[];
  };
  message?: string | null;
  status?: string;
};

export type UserState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
  status: string;
};

export type UserForm = {
  email: string;
  password: string;
};

export type CreateUserForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoadingProps = {
  loading: boolean
}
