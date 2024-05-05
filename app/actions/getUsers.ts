import { User } from "@prisma/client";
import getSession from "./getSession";
import prismaClient from '@/libs/prismadb';

export default async function getUsers(): Promise<User[]> {
    try {
        const session = await getSession();

        if (!session?.user?.email) {
            return [];
        }

        const users = await prismaClient.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                NOT: {
                    email: session.user.email
                }
            }
        });

        return users;

    } catch (err: any) {
        return [];
    }
}
