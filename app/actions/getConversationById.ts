
import { Conversation } from "@prisma/client";
import prismaClient from '@/libs/prismadb';
import { FullConversationType } from "@/types";
import getCurrentUser from "./getCurrentUser";

async function getConversationById(conversationId: string) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.email) return;

        const conversation = await prismaClient.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        })

        return conversation;
    } catch (err) {
        return
    }
};

export default getConversationById;
