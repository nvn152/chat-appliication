"use client";

import Chat from "@/components/Chat";
import Chats from "@/components/Chats";
import LeftNav from "@/components/LeftNav";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useChat } from "@/context/ChatContext";

export default function Home() {
  const router = useRouter();

  const { currentUser, loading } = useAuth();

  const { data } = useChat();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading]);

  return !currentUser ? (
    <Loader />
  ) : (
    <div className="bg-c1 flex h-[100vh]">
      <div className="flex w-full shrink-0">
        <LeftNav />

        <div className="flex bg-c2 grow">
          <div className="w-[400px] p-5 overflow-auto scrollbar shrink-0 border-r border-white/[0.05]">
            <div className="flex flex-col h-full">
              <Chats />
            </div>
          </div>
          {data.user && <Chat />}
        </div>
      </div>
    </div>
  );
}
