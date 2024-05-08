import { NextResponse } from "next/server";
import { getCurrentUser } from '@/app/actions';
import prismaClient from '@/libs/prismadb';
import { pusherServer } from "@/libs/pusher";

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

        // currentUser already seen the last message => there is no need to mark as `seen` anymore
        if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(conversation)
        }

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

        // update realtime SEEN Status
        await pusherServer.trigger(currentUser.email, 'conversation:update', {
            id: conversation.id,
            message: [updateMessage]
        });

        await pusherServer.trigger(conversationId!, "message:update", updateMessage)

        return NextResponse.json(updateMessage)

    } catch (err) {
        console.log(err, "ERROR_MESSAGE_SEEN");
        return new NextResponse("Internal Error", { status: 500 })
    }
}