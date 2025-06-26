import Chat from "@/components/client/shared/Chat";
import React from "react";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ msgID: string }>;
}) {
  const { msgID } = await params;
  return <Chat />;
}
