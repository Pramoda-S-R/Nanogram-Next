import { getCurrentUser, getUserByUsername } from "@/app/actions/api";
import Chat from "@/components/client/shared/Chat";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const ChatPage = async ({
  params,
}: {
  params: Promise<{ msgId: string }>;
}) => {
  const { msgId } = await params;
  const cUser = await currentUser();
  const currentUserObj = await getCurrentUser({ user_id: cUser?.id || "" });
  const contact = await getUserByUsername({ username: msgId });
  if (!currentUserObj) {
    return <div className="text-center text-red-500">There was an error</div>;
  }
  if (!contact) {
    return <div className="text-center text-red-500">User not found</div>;
  }
  return <Chat currentUser={currentUserObj} contact={contact} />;
}

export default ChatPage;