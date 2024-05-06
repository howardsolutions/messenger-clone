import { NextResponse } from "next/server";
import { getCurrentUser } from '@/app/actions';
import prismaClient from '@/libs/prismadb';

type TParams = {
    conversationId?: string
}

export async function DELETE(request: Request,
    { params }: { params: TParams }
) {
    try {
        const { conversationId } = params;

        const currentUser = await getCurrentUser();

        if (!currentUser?.id || !currentUser.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const existingConversation = await prismaClient.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });


        if (!existingConversation) {
            return new NextResponse("Invalid Conversation", { status: 400 });
        }

        const deletedConversation = await prismaClient.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        })

        return NextResponse.json({ message: 'Conversation deleted successfully' })

    } catch (err) {
        console.log(err, "DELETE conversation err");
        return new NextResponse("Internal Error", { status: 500 })
    }
}