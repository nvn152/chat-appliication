import { useChat } from "@/context/ChatContext";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import ChatFooter from "./ChatFooter";
import { useAuth } from "@/context/AuthContext";

const Chat = () => {
  const { currentUser } = useAuth();
  const { data, users } = useChat();

  const isUserBlocked = users[currentUser.uid]?.blockedUsers?.find(
    (u) => u === data?.user.uid
  );

  const IamBlocked = users[data?.user.uid]?.blockedUsers?.find(
    (u) => u === currentUser.uid
  );

  return (
    <div className="flex flex-col p-5 grow">
      <ChatHeader />
      {data.chatId && <Messages />}
      {!isUserBlocked && !IamBlocked && <ChatFooter />}

      {isUserBlocked && (
        <div className="w-full text-center text-c3 py-5">
          You can&apos;t reply to this conversation anymore
        </div>
      )}

      {IamBlocked && (
        <div className="w-full text-center text-c3 py-5">
          {`${data.user.displayName} has blocked you`}
        </div>
      )}
    </div>
  );
};

export default Chat;
