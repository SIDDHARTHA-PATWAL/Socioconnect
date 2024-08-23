// Sidebar.js
import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Home, Search, Explore, VideoLibrary } from '@mui/icons-material';
import { styled } from '@mui/system';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setMode } from 'state';
import { useNavigate } from 'react-router-dom';
import {useTheme} from '@mui/material';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 56,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const IconContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

  return (
    <SidebarContainer>
      <IconContainer onClick={()=>{navigate("/home")}}>
        <Home />
        {/* <Typography variant="body2" sx={{ marginLeft: 1 }}>
          Home
        </Typography> */}
      </IconContainer>
      <IconContainer>
        <Search />
        {/* <Typography variant="body2" sx={{ marginLeft: 1 }}>
          Search
        </Typography> */}
      </IconContainer>
      <IconContainer>
        <Explore />
        {/* <Typography variant="body2" sx={{ marginLeft: 1 }}>
          Explore
        </Typography> */}
      </IconContainer>
      <IconContainer>
        <VideoLibrary />
        {/* <Typography variant="body2" sx={{ marginLeft: 1 }}>
          Reels
        </Typography> */}
      </IconContainer>
      <IconContainer onClick={() => dispatch(setMode())}>
        {theme.palette.mode === "dark" ? (
            <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
            <LightMode sx={{ color: dark, fontSize: "25px" }} />
        )}
      </IconContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
