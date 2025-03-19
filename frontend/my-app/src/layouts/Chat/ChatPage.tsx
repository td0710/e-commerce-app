import React, { useRef, useEffect, useState } from "react";
import "./chat.css";
import { Navbar } from "../NavbarAndFooter/Navbar";
import Footer from "../NavbarAndFooter/Footer";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import axios from "axios";

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const [input, setInput] = useState<string>("");
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const currentUser = localStorage?.getItem("username") ?? "Anonymous";

  useEffect(() => {
    if (stompClient) return;

    const sock = new SockJS(`http://localhost:8080/chat`);
    const client = Stomp.over(sock);

    client.connect({}, () => {
      setStompClient(client);
      client.subscribe(`/topic/room/${currentUser}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, newMessage]);
      });
    });

    return () => {
      client.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (): void => {
    if (input.trim() === "" || !stompClient) return;

    const newMessage: Message = {
      sender: currentUser,
      content: input,
      timestamp: `123`,
    };

    console.log(newMessage);
    stompClient.send(
      `/app/sendMessage/${currentUser}`,
      {},
      JSON.stringify(newMessage)
    );
    setInput("");
  };
  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await axios.get(
          `http://localhost:8080/${currentUser}/messages`
        );
        console.log(messages);
        setMessages(messages.data);
        console.log("kkk");
      } catch (error) {}
    }
    loadMessages();
  }, []);
  return (
    <>
      <Navbar />
      <div className="chat-container">
        <main ref={chatBoxRef} className="chat-messages">
          {messages.map((message, index) => {
            const currentDate = new Date(
              message.timestamp
            ).toLocaleDateString();
            const previousDate =
              index > 0
                ? new Date(messages[index - 1].timestamp).toLocaleDateString()
                : null;

            return (
              <React.Fragment key={index}>
                {/* Hiển thị ngày nếu khác ngày trước đó */}
                {currentDate !== previousDate && (
                  <div className="chat-date-separator">{currentDate}</div>
                )}

                <div
                  className={`message ${
                    message.sender === currentUser ? "sent" : "received"
                  }`}
                >
                  <div className="message-content">
                    <p className="sender">{message.sender}</p>
                    <p>{message.content}</p>
                    <p className="timestamp">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </main>

        <div className="chat-input-container">
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              type="text"
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
