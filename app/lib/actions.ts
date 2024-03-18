'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  CreateUserForm,
  CustomerState,
  FormattedCustomersTable,
  Invoice,
  InvoiceForm,
  InvoicesTable,
  InvoicesTableFormatted,
  State,
  UserForm,
  UserState,
} from './definitions';
import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchRevenue() {
  try {
    const revenues = await fetch(`${BASE_URL}/revenue`);
    const revenuesData = await revenues.json();
    return revenuesData;
  } catch (error) {
    return {
      message: 'Failed to get Revenue.',
    };
  }
}

export async function fetchLatestInvoices() {
  try {
    const latestInvoices = await fetch(`${BASE_URL}/invoices/latest`);
    const data = await latestInvoices.json();
    return data;
  } catch (error) {
    return {
      message: 'Failed to fetch the latest invoices.',
    };
  }
}

export async function fetchCardData() {
  try {
    const invoiceCount = fetch(`${BASE_URL}/invoices/count`);
    const customerCount = fetch(`${BASE_URL}/customers/count`);
    const invoiceStatus = fetch(`${BASE_URL}/invoices/status`);
    const data = await Promise.all([
      invoiceCount,
      customerCount,
      invoiceStatus,
    ]);
    const [numberOfInvoices, numberOfCustomers, totalAmoutInvoice] =
      await Promise.all(data.map((promise) => promise.json()));
    const { paid, pending } = totalAmoutInvoice;
    revalidatePath('/dashboard');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices: paid,
      totalPendingInvoices: pending,
    };
  } catch (error) {
    return {
      message: 'Failed to fetch card data.',
    };
  }
}

export async function fetchFilteredCustomers(
  query?: string,
): Promise<FormattedCustomersTable[]> {
  try {
    const customersDetails = await fetch(
      `${BASE_URL}/invoices/customers/status?query=${query}`,
    );
    const data = await customersDetails.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    return [
      {
        _id: '',
        name: '',
        email: '',
        image_url: '',
        total_invoices: 0,
        total_pending: '',
        total_paid: '',
      },
    ];
  }
}

export async function verifyImageURL(image_url: string) {
  try {
    const response = await fetch(image_url);
    if (!response.ok) {
      throw new Error('Invalid image URL.');
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('The URL does not point to an image.');
    }
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes('failed')) error.message = 'Invalid image URL.';
      return {
        message: error.message,
      };
    }
  }
}

export async function createCustomer(
  prevState: CustomerState,
  formData: FormData,
) {
  try {
    // Crear un nuevo FormData solo con los datos del formulario
    const cleanedFormData = new FormData();
    formData.forEach((value, key) => {
      if (key !== '$ACTION_REF_1' && !key.startsWith('$ACTION_1:')) {
        cleanedFormData.append(key, value);
      }
    });
    const response = await fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      body: cleanedFormData,
    });
    const data = await response.json();
    if (response.status !== 201) throw new Error(data.message);
  } catch (error) {
    if (error instanceof Error) {
      return {
        ...prevState,
        message: error.message,
        status: `error at ${new Date().toLocaleTimeString()}`,
      };
    }
  }
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/invoices/create');
  redirect('/dashboard/customers');
}

export async function fetchCustomers() {
  try {
    const customers = await fetch(`${BASE_URL}/customers`);
    const data = await customers.json();
    // delete cache and revalidate path to update the data
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/invoices/create');
    return data;
  } catch (error) {
    return {
      message: 'Failed to fetch customers.',
    };
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
): Promise<InvoicesTableFormatted[]> {
  try {
    const url = `${BASE_URL}/invoices/details?query=${query}&page=${currentPage}`;
    const invoicesData = await fetch(url);
    const invoices = await invoicesData.json();
    const formattedInvoices = invoices.map((invoice: InvoicesTable) => {
      return {
        _id: invoice._id,
        customer_id: invoice.customer_id,
        name: invoice.customer_id.name,
        email: invoice.customer_id.email,
        image_url: invoice.customer_id.image_url,
        amount: invoice.amount,
        status: invoice.status,
        date: invoice.date,
      };
    });
    return formattedInvoices;
  } catch (error) {
    return [
      {
        _id: '',
        customer_id: '',
        name: '',
        email: '',
        image_url: '',
        date: '',
        amount: 0,
        status: 'pending',
      },
    ];
  }
}

export async function createInvoice(prevState: State, formData: FormData) {
  const invoiceFormData: InvoiceForm = {
    customer_id: formData.get('customerId') as string,
    amount: Number(formData.get('amount')) as number,
    status: formData.get('status') as 'paid' | 'pending',
  };
  const invoice = {
    ...invoiceFormData,
    date: new Date().toISOString().split('T')[0],
  };
  try {
    const response = await fetch(`${BASE_URL}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoice),
    });
    if (response.status !== 201) throw new Error();
  } catch (error) {
    return {
      ...prevState,
      status: `error at ${new Date().toLocaleTimeString()}`,
    };
  }
  revalidateTag('/dashboard/invoices');
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/invoices/${id}`, {
      method: 'DELETE',
    });
    if (response.status !== 204) throw new Error('Failed to delete invoice.');
  } catch (error) {
    return {
      message: error,
    };
  }
  revalidatePath('/dashboard/invoices');
}

export async function fetchInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const invoice = await fetch(`${BASE_URL}/invoices/${id}`);
    return invoice.json();
  } catch (error) {
    return null;
  }
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const invoiceFormData: InvoiceForm = {
    customer_id: formData.get('customerId') as string,
    amount: Number(formData.get('amount')) as number,
    status: formData.get('status') as 'paid' | 'pending',
  };
  try {
    const response = await fetch(`${BASE_URL}/invoices/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceFormData),
    });
    if (response.status !== 200) throw new Error('Failed to update invoice.');
  } catch (error) {
    return {
      ...prevState,
    };
  }
  revalidateTag('/dashboard/invoices');
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/invoices');
}

export async function fetchInvoicesPages(query: string) {
  try {
    const response = await fetch(`${BASE_URL}/invoices/count?query=${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const count = await response.json();
    const ITEMS_PER_PAGE = 6;
    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);
    revalidatePath('/dashboard/invoices');
    return totalPages;
  } catch (error) {
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function login(prevState: UserState, formData: FormData) {
  const user = Object.fromEntries(formData.entries()) as UserForm;
  user.email = user.email.toLowerCase();
  try {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (response.status !== 200) {
      const { message } = await response.json();
      throw new Error(message);
    }
    // obtener el token del usuario desde el response
    const { usertoken, expirationTime } = await response.json();
    cookies().set('usertoken', usertoken, {
      expires: new Date(expirationTime),
      path: '/',
      httpOnly: true,
    });
    revalidatePath('/dashboard');
  } catch (error) {
    if (error instanceof Error) {
      return {
        ...prevState,
        message: error.message,
        status: `error at ${new Date().toLocaleTimeString()}`,
      };
    }
  }
  redirect('/dashboard');
}

export async function logout() {
  try {
    const userToken = cookies().get('usertoken')?.value;
    const response = await fetch(`${BASE_URL}/user/logout`, {
      headers: {
        Cookie: `usertoken=${userToken}`,
      },
    });
    if (response.status !== 200) throw new Error('Failed to sign out');
    cookies().delete('usertoken');
    return {
      message: 'Signed out successfully',
    };
  } catch (error) {
    return {
      error: 'Failed to sign out',
    };
  }
}

export async function register(prevState: UserState, formData: FormData) {
  const user = Object.fromEntries(formData.entries()) as CreateUserForm;
  user.email = user.email.toLowerCase();
  try {
    const response = await fetch(`${BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }
    // obtener el token del usuario desde el response
    const { usertoken, expirationTime } = await response.json();
    cookies().set('usertoken', usertoken, {
      expires: new Date(expirationTime),
      path: '/',
      httpOnly: true,
    });
    revalidatePath('/dashboard');
  } catch (error) {
    if (error instanceof Error) {
      return {
        ...prevState,
        message: error.message,
        status: `error at ${new Date().toLocaleTimeString()}`,
      };
    }
  }
  redirect('/dashboard');
}
