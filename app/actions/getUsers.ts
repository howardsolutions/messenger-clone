import getSession from "./getSession";
import prismaClient from '@/libs/prismadb';

export default async function getUsers() {
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
