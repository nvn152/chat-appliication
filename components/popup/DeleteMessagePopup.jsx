import PopupWrapper from "./PopupWrapper";
import { useAuth } from "@/context/AuthContext";

import { useChat } from "@/context/ChatContext";
import { DELETED_FOR_EVERYONE, DELETED_FOR_ME } from "@/utils/constants";
import { RiErrorWarningLine } from "react-icons/ri";

const DeleteMessagePopup = (props) => {
  const { currentUser } = useAuth();
  const { users, dispatch } = useChat();

  return (
    <PopupWrapper {...props}>
      <div className="mt-10 mb-5 ">
        <div className="flex items-center justify-center gap-3">
          <RiErrorWarningLine size={24} className="text-red-500" />
          <div className="text-lg">Confirm Delete</div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-10">
          {props.self && (
            <button
              onClick={() => {
                props.deleteMessage(DELETED_FOR_ME);
              }}
              className="border-[2px] border-red-700 py-2 px-4 text-sm rounded-md text-red-500 hover:bg-red-700 hover:text-white"
            >
              Delete From Me
            </button>
          )}
          <button
            onClick={() => {
              props?.deleteMessage(DELETED_FOR_EVERYONE);
            }}
            className="border-[2px] border-red-700 py-2 px-4 text-sm rounded-md text-red-500 hover:bg-red-700 hover:text-white"
          >
            Delete From Everyone
          </button>

          <button
            onClick={props.onHide}
            className="border-[2px] border-white-700 py-2 px-4 text-sm rounded-md text-white-500 hover:bg-white hover:text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
};

export default DeleteMessagePopup;
