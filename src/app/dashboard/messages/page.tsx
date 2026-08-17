/** @format */

import { getConversations, getMessages } from "@/src/actions/dataActions";
import MessagesClient from "@/src/components/MessagesClient";
import { serverSupabase } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const conversationId = params.conversation as string | undefined;
  const supabase = await serverSupabase();

  // 1. Fetch Auth User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentUserId = user?.id;

  // FIX: Handle the case where the user is not authenticated.
  // Next.js redirect() throws an error, so TypeScript knows execution
  // stops here if currentUserId is undefined.
  if (!currentUserId) {
    redirect("/login"); // Adjust this route to match your authentication page
  }

  // Now TypeScript knows currentUserId is safely a 'string'
  // 2. Fetch Conversations
  const conversations = await getConversations(currentUserId);
  console.log("Fetched Conversations:", conversations);

  // 3. Handle Empty & Auto-Select states securely on the server
  if (conversations.length === 0) {
    return (
      <MessagesClient
        currentUserId={currentUserId}
        conversations={[]}
        messages={[]}
      />
    );
  }

  if (!conversationId) {
    // URL-driven architecture: Server forces the URL to have the correct state
    redirect(`/dashboard/messages?conversation=${conversations[0].id}`);
  }

  // 4. Fetch specific messages for selected conversation
  // (TypeScript also safely knows conversationId is a 'string' here because of the check above)
  const messages = await getMessages(conversationId);

  return (
    <MessagesClient
      currentUserId={currentUserId}
      conversations={conversations}
      messages={messages}
      selectedConversationId={conversationId}
    />
  );
}
