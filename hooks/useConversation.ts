import { useParams } from "next/navigation";

export default function useConversation() {
    const params = useParams();

    const conversationId = !params?.conversationId ? '' : params.conversationId as string;

    const isOpen = !!conversationId;

    return { isOpen, conversationId }
}