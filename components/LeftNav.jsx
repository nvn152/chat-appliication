/* eslint-disable no-prototype-builtins */

import React, { useEffect, useRef, useState } from "react";
import { BiEdit } from "react-icons/bi";
import Avatar from "./Avatar";
import { useAuth } from "@/context/AuthContext";
import Icon from "./Icon";

import { FiPlus } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";

import {
  Timestamp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "@/firebase/firebase";

import UsersPopup from "./popup/UsersPopup";
import { useChat } from "@/context/ChatContext";

import EditPofileContainer from "./EditProfileContainer";

const LeftNav = () => {
  const [usersPopup, setUsersPopup] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  const { currentUser, signOutUser, setCurrentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [unreadMsgs, setUnreadMsgs] = useState({});

  const isBlockExecutedRef = useRef(false);
  const isUsersFetchedRef = useRef(false);

  //chat data fro user icons
  const {
    users,
    setUsers,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    dispatch,
    data,
    resetFooterStates,
  } = useChat();

  const authUser = auth.currentUser;

  const handleSelect = (user, selectedChatId) => {
    setSelectedChat(user);
    dispatch({ type: "CHANGE_USER", payload: user });

    if (unreadMsgs?.[selectedChatId]?.length > 0) {
      readChat(selectedChatId);
    }
  };

  const readChat = async (chatId) => {
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);

    let updatedMessages = chatDoc.data().messages.map((m) => {
      if (m?.read === false) {
        m.read = true;
      }
      return m;
    });
    await updateDoc(chatRef, {
      messages: updatedMessages,
    });
  };

  const filteredChats = Object.entries(chats || {})
    .filter(([, chat]) => !chat.hasOwnProperty("chatDeleted"))
    .filter(
      ([, chat]) =>
        chat?.userInfo?.displayName
          .toLowerCase()
          .includes(search.toLocaleLowerCase()) ||
        chat?.lastMessage?.text
          .toLowerCase()
          .includes(search.toLocaleLowerCase())
    )
    .sort((a, b) => b[1].date - a[1].date);

  useEffect(() => {
    resetFooterStates();
  }, [data?.chatId]);

  useEffect(() => {
    onSnapshot(collection(db, "users"), (snapshot) => {
      const updatedUsers = {};
      snapshot.forEach((doc) => {
        updatedUsers[doc.id] = doc.data();
      });
      setUsers(updatedUsers);
      if (!isBlockExecutedRef.current) {
        isUsersFetchedRef.current = true;
      }
    });
  }, []);

  useEffect(() => {
    const documentIds = Object.keys(chats);
    if (documentIds.length === 0) return;
    const q = query(
      collection(db, "chats"),
      where("__name__", "in", documentIds)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      let msgs = {};
      snapshot.forEach((doc) => {
        if (doc.id !== data.chatId) {
          msgs[doc.id] = doc
            .data()
            .messages.filter(
              (m) => m?.read === false && m?.sender !== currentUser.uid
            );
        }
        Object.keys(msgs || {})?.map((c) => {
          if (msgs[c]?.length < 1) {
            delete msgs[c];
          }
        });
      });
      setUnreadMsgs(msgs);
    });
    return () => unsub();
  }, [chats, selectedChat]);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setChats(data);

          if (
            !isBlockExecutedRef.current &&
            isUsersFetchedRef.current &&
            users
          ) {
            const firstChat = Object.values(data)
              .filter((chat) => !chat.hasOwnProperty("chatDeleted"))
              .sort((a, b) => b.date - a.date)[0];

            if (firstChat) {
              const user = users[firstChat?.userInfo?.uid];

              handleSelect(user);

              const chatId =
                currentUser.uid > user?.uid
                  ? currentUser.uid + user?.uid
                  : user?.uid + currentUser.uid;

              readChat(chatId);
            }

            isBlockExecutedRef.current = true;
          }
        }
      });
    };
    currentUser.uid && getChats();
  }, [isBlockExecutedRef.current, users]);

  return (
    <div
      className={`${
        editProfile ? "w-[350px]" : "w-[80px] items-center"
      } flex flex-col  justify-between py-5 shrink-0 transition-all`}
    >
      {editProfile ? (
        <EditPofileContainer setEditProfile={setEditProfile} />
      ) : (
        <div
          className="relative group cursor-pointer "
          onClick={() => setEditProfile(true)}
        >
          <Avatar size="large" user={currentUser} />
          <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex">
            <BiEdit size={14} />
          </div>
          <hr className="mt-4 border-slate-700 " />
        </div>
      )}

      <ul className="flex flex-col w-full py-8 gap-[2px]">
        {Object.keys(users || {}).length > 0 &&
          filteredChats?.map((chat) => {
            const timestamp = new Timestamp(
              chat[1].date?.seconds,
              chat[1].date?.nanoseconds
            );

            const date = timestamp.toDate();

            const user = users[chat[1].userInfo.uid];
            return (
              <li
                key={chat[0]}
                onClick={() => handleSelect(user, chat[0])}
                className={` flex items-center gap-2  hover:bg-c1 p-4 cursor-pointer ${
                  selectedChat?.uid === user?.uid ? "bg-c1" : ""
                }`}
              >
                <Avatar size="x-large" user={user} />
              </li>
            );
          })}
      </ul>

      <div
        className={`flex gap-5 ${
          editProfile ? "ml-5" : "flex-col items-center"
        }`}
      >
        <Icon
          size="x-large"
          className="bg-green-500 hover:bg-gray-600"
          icon={<FiPlus size={24} />}
          onClick={() => setUsersPopup(!usersPopup)}
        />
        <Icon
          size="x-large"
          className="hover:bg-c2"
          icon={<IoLogOutOutline size={24} />}
          onClick={signOutUser}
        />
      </div>
      {usersPopup && (
        <UsersPopup onHide={() => setUsersPopup(false)} title="Find Users" />
      )}
    </div>
  );
};

export default LeftNav;
