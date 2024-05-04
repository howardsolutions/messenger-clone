import getSession from "./getSession";
import prismaClient from '@/libs/prismadb';

export default async function getCurrentUser() {
    try {
        const session = await getSession();

        if (!session?.user?.email) {
            return null;
        }

        const currentUser = await prismaClient.user.findUnique({
            where: {
                email: session.user.email as string
            }
        });

        if (!currentUser) return null;

        return currentUser;
    } catch (err: any) {
        return null;
    }
}
