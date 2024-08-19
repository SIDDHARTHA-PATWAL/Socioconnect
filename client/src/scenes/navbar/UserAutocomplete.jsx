import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import baseURL from 'baseURL';

const UserAutocomplete = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const userId = user?._id;

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`${baseURL}users/${userId}/users`,{
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
  }, [userId]);

  const handleChange = (event, value) => {
    if (value && value._id) {
      navigate(`/profile/${value._id}`);
      // navigate(0)
    }
  };

  return (
    <Autocomplete
      options={users}
      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
      onChange={handleChange}
      renderInput={(params) => <TextField {...params} label="Search Users" variant="outlined" />}
      renderOption={(props, option) => (
        <ListItem
          {...props}
          // key={option._id} // Ensure this key is unique for each option
          component="div"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <ListItemAvatar>
            <Avatar src={option.picturePath || '/path/to/default/image.jpg'} />
          </ListItemAvatar>
          <ListItemText
            primary={`${option.firstName} ${option.lastName}`}
            secondary={option.occupation}
          />
        </ListItem>
      )}
      style={{ width: 300 }}
    />
  );
};

export default UserAutocomplete;
