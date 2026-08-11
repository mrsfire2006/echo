'use client'

import { Separator } from "@/components/ui/separator";
import ConversationHeader from "@/features/chat/components/conversation/conversation-header";
import { useGetConversationDetails } from "@/features/chat/hooks";
import { ParamValue } from "next/dist/server/request/params";
import { useParams, useRouter } from "next/navigation"

export default function ConversationPage() {
    const params = useParams();
    const router = useRouter();
    const conversationId = params.conversationId?.toString();
    const { data: conversation } = useGetConversationDetails(conversationId ?? "");

    return <section className="p-3">
        <ConversationHeader onLine username={conversation?.value?.name!} conversationId={conversationId!} />
        <Separator orientation="horizontal" className="mx-auto"/>
    </section>
}