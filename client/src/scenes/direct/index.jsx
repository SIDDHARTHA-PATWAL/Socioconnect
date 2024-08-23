// Direct.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import baseURL from 'baseURL';
import { Box, Card, CardContent, Avatar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import the Sidebar component

const Direct = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const userId = user?._id;
    const navigate = useNavigate();

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

    const handleUserClick = (user) => {
        setSelectedUser(user);
        navigate(`/direct/${user._id}`); // Navigate to the new route
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Sidebar /> {/* Include Sidebar */}

            <Box sx={{ display: 'flex', flex: 1 }}>
                {/* Left side: User List */}
                <Box
                    sx={{
                        width: '30%',
                        overflowY: 'auto',
                        borderRight: '1px solid #ddd',
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
                            {/* Implement chat UI here */}
                            <Typography variant="body1">This is where the chat content will appear.</Typography>
                        </Box>
                    ) : (
                        <Typography variant="h5">Select a user to start chatting</Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Direct;
