import prismaClient from '@/libs/prismadb';
import { Message } from 'postcss';

async function getMessages(conversationId: string) {
    try {
        const messages = await prismaClient.message.findMany({
            where: {
                conversationId: conversationId,
            },
            include: {
                sender: true,
                seen: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return messages;
    } catch (err) {
        return []
    }
};

export default getMessages;
