'use client';
import * as React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/navigation';


export default function LeftSidebar() {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/top');
  };

  const handleProfileClick = () => {
    router.push('/plofile');
  };

  const menuItems = [
    { text: 'ホーム', icon: <HomeIcon />, onClick: handleHomeClick },
    { text: 'プロフィール', icon: <PersonIcon />, onClick: handleProfileClick },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="main mailbox folders">
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={item.onClick}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </nav>
    </Box>
  );
}
