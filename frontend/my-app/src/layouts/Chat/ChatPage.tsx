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
  timeStamp: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const [input, setInput] = useState<string>("");
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const currentUser: string = "User2";

  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`http://localhost:8080/chat`);
      const client = Stomp.over(sock);
      let test;

      client.connect({}, () => {
        setStompClient(client);
        client.subscribe(`/topic/room/room_101`, (message) => {
          const newMessage = JSON.parse(message.body);
          test = newMessage;
          console.log(newMessage);
          setMessages((prev) => [...prev, newMessage]);
        });
      });
      console.log(test);
    };

    connectWebSocket();
  }, []);

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
      timeStamp: `123`,
    };

    console.log(newMessage);
    stompClient.send(
      `/app/sendMessage/room_101`,
      {},
      JSON.stringify(newMessage)
    );

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };
  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await axios.get(
          "http://localhost:8080/room_101/messages"
        );
        console.log(messages);
        setMessages(messages.data);
      } catch (error) {}
    }
    loadMessages();
  }, []);
  return (
    <>
      <Navbar />
      <div className="chat-container">
        <main ref={chatBoxRef} className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender === currentUser ? "sent" : "received"
              }`}
            >
              <div className="message-content">
                <div className="message-inner">
                  <div className="message-details">
                    <p className="sender">{message.sender}</p>
                    <p>{message.content}</p>
                    <p className="timestamp">{message.timeStamp}</p>
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
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              type="text"
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChatPage;
