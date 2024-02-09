import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import socketIOClient from 'socket.io-client';

const MatchChat = ({ mySelf, datedUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (datedUser) {
        const newSocket = socketIOClient('http://localhost:5000', {
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            console.log('Connected to server');

            newSocket.emit('joinChat', {ownChat: mySelf._id, chatWith: datedUser._id}); 
        });

        newSocket.on('message', (message) => {
            console.log('Received message:', message);
            if(message.senderId == datedUser._id)
                setMessages(prevMessages => [...prevMessages, message]);
        });

        newSocket.on('chatHistory', (history) => {
            console.log('Received chat history:', history);
            
            setMessages(history.map((message, index) => ({
                senderId: message.sender,
                message: message.content
            })));
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }
}, [datedUser]);

const sendMessage = () => {
    
    if (socket) {
        
        socket.emit('sendMessage', { senderId: mySelf._id, receiverId: datedUser._id, message: inputMessage });
        
        setInputMessage('');
        setMessages([...messages, { senderId: mySelf._id, message: inputMessage }]);
    }
};

  return (
    <div className={styles.chatContainer}>
        <h3>Discussion avec {datedUser.prenom}</h3>
      <div className={styles.messagesContainer}>
      {messages.map((message, index) => (
        <div key={index} className={`${styles.message} ${message.senderId === mySelf._id ? styles.sentMessage : styles.receivedMessage}`}>
            <p>{message.message}</p>
        </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className={styles.inputField}
        />
        <button onClick={sendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

export default MatchChat;
