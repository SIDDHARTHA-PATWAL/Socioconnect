import React, { useState, useEffect ,useRef } from 'react';
import { useSelector } from 'react-redux';
import baseURL from 'baseURL';
import { Box, Card, CardContent, Avatar, Typography, TextField, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import io from 'socket.io-client';

const socket = io(`${baseURL}`, {
    reconnection: true,   // Enable reconnection
    reconnectionAttempts: 5,   // Retry up to 5 times
    reconnectionDelay: 1000,   // Wait 1 second between reconnection attempts
    timeout: 20000   // Set timeout for connection attempts
});

const Direct = () => {
    const theme = useTheme(); // Access the theme
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const userId = user?._id;
    const navigate = useNavigate();
    const chatContainerRef = useRef(null); // Reference to the chat container

    useEffect(() => {
        if (userId) {
            socket.emit('register', userId);
        }

        socket.on('private_message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('private_message');
        };
    }, [userId]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`${baseURL}users/${userId}/users`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [userId, token]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            if (selectedUser && userId) {
                try {
                    const response = await fetch(`${baseURL}chats/${userId}/${selectedUser._id}`, {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch chat history');
                    }
                    const chatHistory = await response.json();
                    setMessages(chatHistory);
                } catch (error) {
                    console.error('Error fetching chat history:', error);
                }
            }
        };

        fetchChatHistory();
    }, [selectedUser, userId, token]);
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]); // Scroll to bottom whenever messages change

    const handleUserClick = (user) => {
        setSelectedUser(user);
        navigate(`/direct/${user._id}`);
    };

    const handleSendMessage = () => {
        if (message.trim() && selectedUser) {
            const newMessage = {
                from: userId,
                to: selectedUser._id,
                text: message,
                timestamp: new Date().toISOString(),
            };
            socket.emit('private_message', newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessage('');
        }
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent the default behavior of creating a new line
            handleSendMessage();
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <Box
                sx={{
                    width: '30%',
                    overflowY: 'auto',
                    borderRight: `1px solid ${theme.palette.divider}`,
                    p: 2,
                    boxSizing: 'border-box',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Messages
                </Typography>
                {users.map(user => (
                    <Card
                        key={user._id}
                        onClick={() => handleUserClick(user)}
                        sx={{ mb: 2, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 56, height: 56 }} src={user.picturePath || '/default-avatar.png'} />
                            <Typography variant="body1" sx={{ ml: 2 }}>
                                {user.firstName}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Right side: Chat Area */}
            <Box
                sx={{
                    width: '70%',
                    p: 2,
                    boxSizing: 'border-box',
                }}
            >
                {selectedUser ? (
                    <Box>
                        <Typography variant="h5">Chat with {selectedUser.firstName}</Typography>
                        <Box ref={chatContainerRef} sx={{ height: '80vh', overflowY: 'auto', border: `1px solid ${theme.palette.divider}`, p: 2 }}>
                            {messages.filter(msg => msg.to === selectedUser._id || msg.from === selectedUser._id).map((msg, index) => (
                                <Box sx={{  display:'flex' ,justifyContent:(msg.to === selectedUser._id) && ('flex-end')}}>
                                <Box
                                    key={index}
                                    sx={{
                                        display:'inline-flex',
                                        maxWidth:'70%',
                                        mb: 1,
                                        justifyContent:(msg.to === selectedUser._id) && ('flex-end'),
                                        p: 1,
                                        borderRadius: '4px',
                                        bgcolor: msg.from === userId ? (theme.palette.mode === 'dark' ? '#4caf50' : '#e0f7fa') : (theme.palette.mode === 'dark' ? '#616161' : '#fff'),
                                        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                                    }} >   
                                {msg.from === selectedUser._id && (
                                        <Avatar
                                            sx={{ width: 30, height: 30 }}
                                            src={selectedUser.picturePath || '/default-avatar.png'}
                                        />
                                        )}
                                    <Box sx={{p:1}}>
                                        <Typography variant="body1">{msg.text}</Typography>
                                        <Typography variant="caption" color="textSecondary">{new Date(msg.timestamp).toLocaleTimeString()}</Typography>
                                    </Box>
                                </Box>
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ mt: 2, display: 'flex' }}>
                            <TextField
                                variant="outlined"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                fullWidth
                                placeholder="Type a message"
                                sx={{ mr: 1 }}
                            />
                            <Button variant="contained" onClick={handleSendMessage}>Send</Button>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="h5">Select a user to start chatting</Typography>
                )}
            </Box>
        </Box>
    );
};

export default Direct;
