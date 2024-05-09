import { NextResponse } from "next/server";
import prismaClient from '@/libs/prismadb';
import { getCurrentUser } from "@/app/actions";
import { pusherServer } from "@/libs/pusher";

/** 
* @summary Api route for new conversation creation
*  
*/
export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();

        // userId - for 1 to 1 conversation
        // isGroup, members, name (of the group) = for group chat
        const { userId, isGroup, members, name } = body;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse("Invalid data", { status: 400 });
        }

        // Create group chat
        if (isGroup) {
            const newGroupConversation = await prismaClient.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        connect: [
                            ...members.map((member: { value: string }) => ({
                                id: member.value
                            })),
                            {
                                id: currentUser.id
                            }
                        ]
                    }
                },
                // populate `users` field in `conversation` 
                // by default it's just an array of userId
                include: {
                    users: true
                }
            });

            newGroupConversation.users.forEach(user => {
                if (user.email) {
                    pusherServer.trigger(user.email, "conversation:new", newGroupConversation)
                }
            });

            return NextResponse.json(newGroupConversation)
        };

        // In fact, between 2 people only exist ONLY ONE conversation, 
        // but here I encoutered an issue when used findUnique, and need to use `findMany` for special query `OR`
        const existingConversation = await prismaClient.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [currentUser.id, userId]
                        }
                    },
                    {
                        userIds: {
                            equals: [userId, currentUser.id]
                        }
                    }
                ]
            }
        });

        const singleConversation = existingConversation[0];

        if (singleConversation) {
            return NextResponse.json(singleConversation)
        }

        const newConversation = await prismaClient.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: currentUser.id
                        },
                        {
                            id: userId
                        }
                    ]
                }
            },
            include: {
                users: true
            }
        });

        newConversation.users.map(user => pusherServer.trigger(user?.email!, 'conversation:new', newConversation))

        return NextResponse.json(newConversation);

    } catch (err) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

