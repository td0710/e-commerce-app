// ChatBox.tsx
import React, { useState, useRef, useEffect } from "react";
import "./adminchat.css";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import axios from "axios";
import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface User {
  name: string;
  lastText: string;
  sender: string;
}

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

const AdminChatPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [input, setInput] = useState<string>("");
  const currentAdmin: string = "admin";
  const [currentUser, setCurrentUser] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stompClient) return; // Tránh tạo lại kết nối khi `selectedUser` thay đổi

    const sock = new SockJS(`http://localhost:8080/chat`);
    const client = Stomp.over(sock);

    client.connect({}, () => {
      setStompClient(client);
      console.log("STOMP Connected");

      if (selectedUser) {
        client.subscribe(`/topic/room/${selectedUser}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      }
    });

    return () => {
      client.disconnect(() => console.log("STOMP Disconnected"));
    };
  }, []);

  useEffect(() => {
    if (!stompClient || !stompClient.connected) return;

    let subscription: any;
    if (selectedUser) {
      subscription = stompClient.subscribe(
        `/topic/room/${selectedUser}`,
        (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        }
      );
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [selectedUser, stompClient]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8080/get/room");
        const formattedUsers: User[] = response.data.map((room: any) => {
          const lastMessage = room.messageList?.at(-1);
          return {
            name: room.roomId,
            lastText: lastMessage ? lastMessage.content : "No messages yet",
            sender: lastMessage.sender,
          };
        });
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng:", error);
      }
    };

    fetchRooms();
  }, []);
  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await axios.get(
          `http://localhost:8080/${selectedUser}/messages`
        );
        console.log(messages);
        setMessages(messages.data);
      } catch (error) {}
    }
    loadMessages();
  }, [selectedUser]);
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (): void => {
    if (input.trim() === "" || !selectedUser) return;

    const newMessage: Message = {
      sender: currentAdmin,
      content: input,
      timestamp: new Date(),
    };
    stompClient?.send(
      `/app/sendMessage/${selectedUser}`,
      {},
      JSON.stringify(newMessage)
    );
    setInput("");
    setInput("");
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="chat-container-sidebar">
        <div className="chat-sidebar">
          <h3>Đoạn Chat</h3>
          <ul>
            {users.map((user) => (
              <li
                className={selectedUser === user.name ? "active" : ""}
                onClick={() => setSelectedUser(user.name)}
              >
                <div className="customer-info">
                  <p className="customer-name">{user.name}</p>
                  <p className="last-message">
                    {user.sender} :
                    {user.lastText.length > 20
                      ? user.lastText.slice(0, 20) + "..."
                      : user.lastText}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="chat-main">
          {selectedUser ? (
            <>
              <div className="chat-header">{selectedUser}</div>
              <main ref={chatBoxRef} className="chat-messages">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${
                      message.sender === selectedUser ? "received" : "sent"
                    }`}
                  >
                    <div className="message-content">
                      <div className="message-inner">
                        <div className="message-details">
                          <p className="sender">
                            {message.sender === "admin"
                              ? "admin"
                              : message.sender}
                          </p>
                          <p>{message.content}</p>
                          <p className="timestamp">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </main>

              <div className="chat-input-container">
                <div className="chat-input">
                  <input
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInput(e.target.value)
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                      e.key === "Enter" && sendMessage()
                    }
                    type="text"
                    placeholder="Nhập tin nhắn..."
                  />
                  <button onClick={sendMessage}>Gửi</button>
                </div>
              </div>
            </>
          ) : (
            <div className="chat-placeholder">
              Chọn một cuộc trò chuyện để bắt đầu nhắn tin.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminChatPage;
