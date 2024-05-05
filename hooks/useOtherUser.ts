import { FullConversationType } from "@/types";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";

function useOtherUser(conversation: FullConversationType | { users: User[] }) {
    const session = useSession();

    const currentUserEmail = session?.data?.user?.email;

    const otherUser = conversation.users.filter(user => user.email !== currentUserEmail);

    return otherUser[0];
}

export default useOtherUser