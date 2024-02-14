'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CreateUserForm, CustomerForm,CustomerState,FormattedCustomersTable, Invoice, InvoiceForm, InvoicesTable, State, UserForm, UserState } from './definitions'
import { cookies } from 'next/headers'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export async function fetchRevenue(){
  try{
    const revenues = await fetch(`${BASE_URL}/revenue`)
    return revenues.json()
  } catch (error) {
    return {
      message: 'Failed to get Revenue.'
    }
  }
}

export async function fetchLatestInvoices() {
  try {
    const latestInvoices = await fetch(`${BASE_URL}/invoices/latest`)
    return latestInvoices.json()
  }
  catch (error) {
    return {
      message: 'Failed to fetch the latest invoices.'
    }
  }
}

export async function fetchCardData() {
  try {
    const invoiceCount = fetch(`${BASE_URL}/invoices/count`)
    const customerCount = fetch(`${BASE_URL}/customers/count`)
    const invoiceStatus = fetch(`${BASE_URL}/invoices/status`)
    const data = await Promise.all([invoiceCount, customerCount, invoiceStatus])
    const [numberOfInvoices, numberOfCustomers, totalAmoutInvoice] = await Promise.all(data.map((promise) => promise.json()))
    const { paid,pending } = totalAmoutInvoice
    revalidatePath('/dashboard')

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices: paid,
      totalPendingInvoices: pending
    }
  }
  catch (error) {
    return {
      message: 'Failed to fetch card data.'
    }
  }
}

export async function fetchFilteredCustomers(query?:string): Promise<FormattedCustomersTable[]> {
  try {
    const customersDetails = await fetch(`${BASE_URL}/invoices/customers/status?query=${query}`)
    const data = await customersDetails.json()
    if(data.error) throw new Error(data.error)
    return data
  } catch (error) {
    return [{
      _id: '',
      name: '',
      email: '',
      image_url: '',
      total_invoices: 0,
      total_pending: '',
      total_paid: ''
    }];
  }
}

export async function createCustomer (prevState:CustomerState,formData: FormData) {
  const customer:CustomerForm = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    image_url: formData.get('image_url') as string
  }
  try {
    const response = await fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customer)
    })
    if (response.status !== 201) throw new Error('Failed to create customer.')
  } catch (error) {
    return {
      message: error
    }
  }
  revalidatePath('/dashboard/invoices/create')
  revalidatePath('/dashboard')
  redirect('/dashboard/customers')
}

export async function fetchCustomers() {
  try {
    const customers = await fetch(`${BASE_URL}/customers`)
    return customers.json()
  } catch (error) {
    return {
      message: 'Failed to fetch customers.'
    }
  }
}

export async function fetchFilteredInvoices(query: string, currentPage: number): Promise<InvoicesTable[]> {
  try {
      const url = `${BASE_URL}/invoices/details?query=${query}&page=${currentPage}`;
      const invoicesData = await fetch(url);
      return invoicesData.json();
  } catch (error) {
      return [{
          _id: '',
          customer_id: '',
          name: '',
          email: '',
          image_url: '',
          amount: 0,
          status: 'pending',
          date: ''
      }];
  }
}

export async function createInvoice (prevState:State, formData : FormData) {
  const invoiceFormData:InvoiceForm = {
    customer_id: formData.get('customerId') as string,
    amount: Number(formData.get('amount')) as number,
    status: formData.get('status') as 'paid' | 'pending',
  }
  const invoice = {
    ...invoiceFormData,
    date: new Date().toISOString().split('T')[0]
  }
  try {
    const response = await fetch(`${BASE_URL}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoice)
    })
    if (response.status !== 201) throw new Error()
  } catch (error) {
    return {
      ...prevState
    }
  }
  revalidatePath('/dashboard/invoices/create')
  revalidatePath('/dashboard/invoices')
  revalidatePath('/dashboard/customers')
  redirect('/dashboard/invoices')
  
}

export async function deleteInvoice(id:string) {
  try {
    const response = await fetch(`${BASE_URL}/invoices/${id}`, {
      method: 'DELETE'
    })
    if (response.status !== 204) throw new Error('Failed to delete invoice.')
  } catch (error) {
    return {
      message: error
    }
  }
  revalidatePath('/dashboard/invoices')
}

export async function fetchInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const invoice = await fetch(`${BASE_URL}/invoices/${id}`)
    return invoice.json()
  } catch (error) {
    return null
  }
}

export async function updateInvoice(id:string, prevState:State, formData : FormData) {
  const invoiceFormData:InvoiceForm = {
    customer_id: formData.get('customerId') as string,
    amount: Number(formData.get('amount')) as number,
    status: formData.get('status') as 'paid' | 'pending',
  }
  try {
    const response = await fetch(`${BASE_URL}/invoices/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoiceFormData)
    })
    if (response.status !== 200) throw new Error('Failed to update invoice.')
  } catch (error) {
    return {
      ...prevState
    }
  }
  revalidatePath('/dashboard/invoices')
  revalidatePath('/dashboard/customers')
  redirect('/dashboard/invoices')
  
}

export async function login(prevState: UserState, formData: FormData){
  const user: UserForm = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
  }
  try {
      const response = await fetch(`${BASE_URL}/user/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
      });

      if (response.status !== 200) {
          throw new Error('Failed to login.');
      }
      // obtener el token del usuario desde el response
      const {usertoken} = await response.json();
      cookies().set('usertoken', usertoken);
      revalidatePath('/dashboard')
  } catch (error) {
      return {
          ...prevState,
          errors: {
              email: ['Invalid email.'],
              password: ['Invalid password.']
          },
          message: 'Invalid email or password.'
      };
  }
  redirect('/dashboard')
}

export async function logout() {
  try {
    const userToken = cookies().get('usertoken')?.value;
    const response = await fetch(`${BASE_URL}/user/logout`, {
      headers: {
        Cookie: `usertoken=${userToken}`
      }
    });
    if (response.status !== 200) throw new Error('Failed to sign out')
    cookies().delete('usertoken');
    return {
      message: 'Signed out successfully'
    }
  } catch (error) {
    return {
      error: 'Failed to sign out'
    }
  }
}

export async function register(prevState: UserState, formData: FormData) {
  const user: CreateUserForm = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string
  }
  try {
    const response = await fetch(`${BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    console.log(response.ok);
    if (!response.ok) throw new Error('Failed to register user.')
    
  } catch (error) {
    return {
      ...prevState,
      errors: {
        email: ['Invalid email.'],
        password: ['Invalid password.']
      },
      message: 'Password and confirm password must match.'
    }
  }
  redirect('/login')
}