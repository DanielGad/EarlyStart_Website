import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import '../../assets/styles/UserMessage.css'
import { useNavigate } from 'react-router-dom';

interface Message {
  senderEmail: string;
  senderName: string; 
  receiverEmail: string;
  receiverName: string;
  messageBody: string;
  timestamp: any; 
}

interface User {
  email: string;
  displayName: string;
  fullName: string; 
}

const UserMessage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatList, setChatList] = useState<User[]>([]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  

  const db = getFirestore();
  const auth = getAuth();

  // Fetch chat history for the current user
  const fetchMessages = (contactEmail: string) => {
    const userEmail = auth.currentUser?.email;

    if (!userEmail) {
      console.warn('User not authenticated');
      return;
    }

    const q = query(
      collection(db, 'messages'),
      where('receiverEmail', 'in', [contactEmail, userEmail]),
      where('senderEmail', 'in', [contactEmail, userEmail])
    );

    onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as unknown as Message));
      const sortedMessages = fetchedMessages.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
      setMessages(sortedMessages);
    });
  };

  // Fetch the list of conversations for the user
  const fetchChatList = () => {
    const userEmail = auth.currentUser?.email;

    if (!userEmail) {
      console.warn('User not authenticated');
      return;
    }

    const q = query(
      collection(db, 'messages'),
      where('receiverEmail', '==', userEmail)
    );

    onSnapshot(q, (snapshot) => {
      const contactEmails = new Set<string>();
      const users: User[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Message;
        if (data.senderEmail && !contactEmails.has(data.senderEmail)) {
          contactEmails.add(data.senderEmail);

          // Fetch user's fullName from EarlyStartData collection
          const userQuery = query(collection(db, 'EarlyStartData'), where('email', '==', data.senderEmail));
          getDocs(userQuery).then(userSnapshot => {
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data() as User;
              users.push({
                email: data.senderEmail,
                displayName: userData.fullName || 'Unknown User',
                fullName: userData.fullName,
              });
            } else {
              users.push({
                email: data.senderEmail,
                displayName: 'Unknown User',
                fullName: '',
              });
            }
            setChatList(users);
          });
        }
      });
    });
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) {
      alert('Please type a message.');
      return;
    }

    const currentUser = auth.currentUser;
    const userEmail = currentUser?.email;
    const userName = currentUser?.displayName || 'User';

    const messageData: Message = {
      senderEmail: userEmail!,
      senderName: userName, 
      receiverEmail: selectedUser.email,
      receiverName: selectedUser.displayName,
      messageBody: newMessage,
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, 'messages'), messageData);
      setNewMessage(''); 
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Toggle the selected chat (open/close)
  const toggleChat = (user: User) => {
    if (selectedUser?.email === user.email) {
      setSelectedUser(null); 
      setIsChatOpen(false); 
    } else {
      setSelectedUser(user);
      fetchMessages(user.email); 
      setIsChatOpen(true);
    }
    
  };

  // Fetch chat list when component mounts
  useEffect(() => {
    fetchChatList();
  }, []);

  return (
    <div className="user-message-container">
      <h2 className="header-title">User Messaging</h2>

      <div className="chat-list-container">
        <h3 className="chat-list-title">Chats</h3>
        <div className="chat-list">
          {chatList.length === 0 ? (
            <p className="no-chats-message">No chats available.</p>
          ) : (
            chatList.map((user, index) => (
              <div
                key={index}
                className={`chat-user ${selectedUser?.email === user.email ? 'active' : ''}`}
                onClick={() => toggleChat(user)}
              >
                <strong>{user.displayName}</strong>
              </div>
            ))
          )}
        </div>
      </div>

      {isChatOpen && selectedUser && (
        <div className="chat-box">
          <h3 className="chat-title">Conversation with {selectedUser.displayName} ({selectedUser.email})</h3>

          <div className="chat-history">
            {messages.length === 0 ? (
              <p className="no-messages">No messages yet!</p>
            ) : (
              messages.map((msg, index) => {
                const isCurrentUser = msg.senderEmail === auth.currentUser?.email;
                return (
                  <div key={index} className={`message ${isCurrentUser ? 'current-user' : 'other-user'}`}>
                    <p><strong>{isCurrentUser ? 'You' : msg.senderName}:</strong> {msg.messageBody}</p>
                    <p className="timestamp">{new Date(msg.timestamp.seconds * 1000).toLocaleString()}</p>
                  </div>
                );
              })
            )}
          </div>

          <div className="message-input-container">
            <textarea
              className="message-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
            />
            <button className="send-message-button" onClick={handleSendMessage}>Send Message</button>
          </div>
        </div>
      )}
      <button className="back-button" onClick={() => navigate(-1)} style={{marginRight: 'auto', marginLeft: 'auto', display: 'block'}}>
            Go Back
          </button>
    </div>
  );
};

export default UserMessage;
