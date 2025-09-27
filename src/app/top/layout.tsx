import * as React from 'react';
import { Box, Container } from '@mui/material';
import LeftSidebar from '@/components/top/LeftSidebar';

export default function TopLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left Sidebar */}
        <Box sx={{
          display: { xs: 'none', sm: 'block' },
          width: { sm: '200px' },
          flexShrink: 0
        }}>
          <LeftSidebar />
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
      </Box>
    </Container>
  );
}
