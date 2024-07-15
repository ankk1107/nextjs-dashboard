import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from 'next-auth/providers/credentials';
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { User } from "./app/lib/definitions";
import bcrypt from 'bcrypt';

async function getUser(email: string) {
    try {
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0]
    } catch (e) {
        throw new Error('Data Error: can not get user')
    }

}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [Credentials({
        async authorize(credentials) {
            const parsedCredential = z
                .object({
                    email: z.string().email(), password: z.string().min(6)
                })
                .safeParse(credentials);

            if(parsedCredential.success){
                const { email, password } = parsedCredential.data;
                const user = await getUser(email);
                if(!user) return null;
                const passwordMatched = await bcrypt.compare(password, user.password);
                if(passwordMatched){
                    return user
                }
            }

            return null;
        }
    })]
})