import { NextResponse } from "next/server";
import { getCurrentUser } from '@/app/actions';
import prismaClient from '@/libs/prismadb';

type TParams = {
    conversationId?: string;
}


export async function POST(request: Request, { params }: { params: TParams }) {
    try {
        const currentUser = await getCurrentUser();
        const { conversationId } = params;

        if (!currentUser?.id || !currentUser.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Find the existing conversation
        const conversation = await prismaClient.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: {
                    include: {
                        seen: true,
                    }
                },
                users: true
            }
        });

        if (!conversation) return new NextResponse("Invalid conversation ID", { status: 400 });

        // find the last message
        const lastMessage = conversation.messages[conversation.messages.length - 1];

        if (!lastMessage) return NextResponse.json(conversation);

        // Update seen  status of last message

        const updateMessage = await prismaClient.message.update({
            where: {
                id: lastMessage.id
            },
            include: {
                sender: true,
                seen: true
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        });

        return NextResponse.json(updateMessage)

    } catch (err) {
        console.log(err, "ERROR_MESSAGE_SEEN");
        return new NextResponse("Internal Error", { status: 500 })
    }
}