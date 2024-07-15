'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { fetchInvoiceById } from './data';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string()
})

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    })
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (e) {
        return {
            message: 'Database Error: can not create invoice.'
        }
    }


    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices')
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    })
    const amountIncents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id=${customerId}, amount=${amountIncents}, status=${status}
            WHERE id=${id}
        `;
    } catch (e) {
        return {
            message: 'Datebase Error: can not update invoice.'
        }
    }

    revalidatePath('dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {    
    try{
        await sql`DELETE from invoices where id = ${id}`;
    }catch(e){
        return {
            message: 'Datebase Erro: can not delete invoice.'
        }
    }
    revalidatePath('/dashboard/invoices');
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try{
        await signIn('credentials', formData)
    }catch(error){
        if(error instanceof AuthError){
            switch(error.type){
                case 'CredentialsSignin':
                    return 'Invalid credential';
                default: 
                    return 'Something weng wrong';
            }
        }
        throw error;
    }
}