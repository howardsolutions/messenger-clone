
import { getCurrentUser } from '@/app/actions';
import { NextResponse } from 'next/server';
import prismaClient from '@/libs/prismadb';
import { pusherServer } from '@/libs/pusher';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const currentUser = await getCurrentUser();

        const {
            message,
            image,
            conversationId
        } = body;

        if (!currentUser?.id || !currentUser.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Create a new Message
        const newMessage = await prismaClient.message.create({
            data: {
                body: message,
                image,
                conversation: {
                    connect: {
                        id: conversationId,
                    }
                },
                sender: {
                    connect: {
                        id: currentUser.id
                    }
                },
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            },
            include: {
                seen: true,
                sender: true,
            }
        });

        // Update conversation with new Message
        const updatedConversation = await prismaClient.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        });

        // Realtime with Pusher
        await pusherServer.trigger(conversationId, 'message:new', newMessage);

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

        updatedConversation.users.map(user => {
            pusherServer.trigger(user.email!, 'conversation:update', {
                id: conversationId,
                messages: [lastMessage]
            })
        })

        return NextResponse.json(newMessage)

    } catch (err: any) {
        console.log(err, "ERR MESSAGES");
        return new NextResponse("Internal Server Error", { status: 500 })
    }

}