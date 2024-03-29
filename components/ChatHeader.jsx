import { useChat } from "@/context/ChatContext";
import { useState } from "react";
import Avatar from "./Avatar";
import Icon from "./Icon";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import ChatMenu from "./ChatMenu";

const ChatHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { users, data } = useChat();

  const online = users[data.user.uid]?.isOnline;
  const user = users[data.user.uid];

  return (
    <div className="flex justify-between items-center pb-5 border-b border-white/[0.05]">
      {user && (
        <div className="flex items-center gap-3">
          <Avatar size="large" user={user} />
          <div>
            <div className="font-medium ">{user.displayName}</div>
            <p className="text-sm text-c3">{online ? "Online" : "Offline"}</p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Icon
          size="large"
          className={`${showMenu ? "bg-c1" : ""} `}
          onClick={() => setShowMenu((showMenu) => !showMenu)}
          icon={<IoEllipsisVerticalSharp size={20} className="text-c3" />}
        />
        {showMenu && <ChatMenu showMenu={showMenu} setShowMenu={setShowMenu} />}
      </div>
    </div>
  );
};

export default ChatHeader;
