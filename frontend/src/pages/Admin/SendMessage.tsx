import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import '../../assets/styles/AdminSendMessage.css'
import { Link, useNavigate } from 'react-router-dom';

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

const AdminSendMessage: React.FC = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatList, setChatList] = useState<User[]>([]);
  const [adminFullName, setAdminFullName] = useState('Admin');
  
  const navigate = useNavigate();

  const db = getFirestore();
  const auth = getAuth();

  // Fetch the admin's full name
  const fetchAdminFullName = async () => {
    const adminEmail = auth.currentUser?.email;

    if (adminEmail) {
      try {
        const adminQuery = query(collection(db, 'EarlyStartData'), where('email', '==', adminEmail));
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          const adminData = adminSnapshot.docs[0].data() as User;
          setAdminFullName(adminData.fullName || 'Admin');
        }
      } catch (error) {
        console.error('Error fetching admin full name:', error);
      }
    }
  };

  // Fetch chat messages for the selected user
  const fetchMessages = (userEmail: string) => {
    const adminEmail = auth.currentUser?.email;

    if (!adminEmail) return; // Early return if adminEmail is undefined

    const q = query(
      collection(db, 'messages'),
      where('receiverEmail', 'in', [userEmail, adminEmail]),
      where('senderEmail', 'in', [userEmail, adminEmail])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      } as unknown as Message)).sort((a, b) => a.timestamp.seconds - b.timestamp.seconds); // Sort by timestamp in ascending order

      setMessages(fetchedMessages);
    });

    return unsubscribe; // Cleanup function
  };

  // Fetch chat list of users
  const fetchChatList = () => {
    const adminEmail = auth.currentUser?.email;

    if (!adminEmail) return; // Early return if adminEmail is undefined

    const q = query(
      collection(db, 'messages'),
      where('senderEmail', '==', adminEmail)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userEmails = new Set<string>();
      const users: User[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Message;
        if (data.receiverEmail && !userEmails.has(data.receiverEmail)) {
          userEmails.add(data.receiverEmail);

          const userQuery = query(collection(db, 'EarlyStartData'), where('email', '==', data.receiverEmail));
          getDocs(userQuery).then(userSnapshot => {
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data() as User;
              users.push({
                email: data.receiverEmail,
                displayName: userData.fullName || "Unknown User",
                fullName: userData.fullName,
              });
            } else {
              users.push({
                email: data.receiverEmail,
                displayName: "Unknown User",
                fullName: '',
              });
            }
            setChatList(users); // Update chat list here
          });
        }
      });
    });

    return unsubscribe; // Cleanup function
  };

  // Handle searching for a user
  const handleSearch = async () => {
    setLoading(true);
    try {
      const userQuery = query(collection(db, 'EarlyStartData'), where('email', '==', searchEmail));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0].data() as User;

        setSelectedUser({
          email: userDoc.email,
          displayName: userDoc.displayName || 'Unknown User',
          fullName: userDoc.fullName,
        });

        fetchMessages(userDoc.email);
        setSearchEmail('')
         // Fetch messages for the selected user
      } else {
        alert('User not found.');
      }
    } catch (error) {
      console.error('Error searching for user:', error);
    }
    setLoading(false);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) {
      alert('Please type a message.');
      return;
    }

    const admin = auth.currentUser;
    const adminEmail = admin?.email;

    const messageData: Message = {
      senderEmail: adminEmail!,
      senderName: adminFullName,
      receiverEmail: selectedUser.email,
      receiverName: selectedUser.fullName,
      messageBody: newMessage,
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, 'messages'), messageData);
      setNewMessage(''); // Clear input
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Toggle chat with the selected user
  const toggleChat = (user: User) => {
    if (selectedUser?.email === user.email) {
      setSelectedUser(null); // Close chat if it's already selected
      setMessages([]); // Clear messages when closing chat
    } else {
      setSelectedUser(user);
      fetchMessages(user.email); // Fetch chat history when opening
    }
  };

  useEffect(() => {
    fetchAdminFullName(); // Fetch admin's full name on mount
    fetchChatList(); // Fetch chat list on mount

    // Fetch messages for the previously selected user if exists
    if (selectedUser) {
      fetchMessages(selectedUser.email);
    }
  }, [selectedUser]); // Re-run when selectedUser changes

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Message Center</h2>
  
      {/* Search User Section */}
      <div className="user-search-section">
        <input
          type="email"
          className="user-search-input"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="user-search-button" onClick={handleSearch}>Search</button>
      </div>
  
      {loading && <p className="loading">Loading...</p>}
  
      {/* Chat List Section */}
      <div className="user-chat-list-section">
        <h3 className="chat-list-header">User Chats</h3>
        <div className="chat-list">
          {chatList.length === 0 ? (
            <p className="no-users">No chats available.</p>
          ) : (
            chatList.map((user, index) => (
              <div 
                key={index} 
                className={`chat-item ${selectedUser?.email === user.email ? 'chat-active' : ''}`} 
                onClick={() => toggleChat(user)}
              >
                <strong>{user.fullName}</strong>
              </div>
            ))
          )}
        </div>
      </div>
  
      {/* Display Selected User Conversation */}
      {selectedUser && (
        <div className="user-conversation-section">
          <h3 className="conversation-header">
            Chat with {selectedUser.fullName} ({selectedUser.email})
          </h3>
  
          {/* Display chat history */}
          <div className="chat-history-box">
            {messages.length === 0 ? (
              <p className="no-messages">No messages yet.</p>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message-box ${msg.senderEmail === auth.currentUser?.email ? 'message-sent' : 'message-received'}`}
                >
                  <p>
                    <strong>
                      {msg.senderEmail === auth.currentUser?.email ? 'You' : msg.receiverName}:
                    </strong> {msg.messageBody}
                  </p>
                  <p className="timestamp">
                    {new Date(msg.timestamp.seconds * 1000).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
  
          {/* Input to send a message */}
          <div className="message-input-area">
            <textarea
              className="message-input-box"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="send-message-btn" onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
      <button className="back-button" onClick={() => navigate('/admin-dashboard')} style={{ textAlign: 'center', marginRight: 'auto', marginLeft: 'auto', display: 'block' }}>
            Go Back
          </button>
    </div>
  );
  
};

export default AdminSendMessage;