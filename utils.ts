import { Conversation, User } from "@prisma/client";

export function getStatusText(
    conversation: Conversation & {
        users: User[];
    },
    isActive: boolean
) {
    if (conversation.isGroup) {
        return `${conversation.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline';
}