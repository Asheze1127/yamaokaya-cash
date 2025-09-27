import * as React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';

const menuItems = [
  { text: 'ホーム', icon: <HomeIcon /> },
  { text: 'プロフィール', icon: <PersonIcon /> },
];

export default function LeftSidebar() {
  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="main mailbox folders">
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton>
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
