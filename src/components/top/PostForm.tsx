import * as React from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Stack
} from '@mui/material';

export default function PostForm() {
  return (
    <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', maxWidth: 1900, margin: 'auto' }}>
        <Stack direction="row" spacing={2}>
            <Avatar sx={{ width: 56, height: 56 }}>U</Avatar>
            <TextField
                id="post-content"
                label="いまどうしてる？"
                multiline
                rows={3}
                variant="outlined"
                fullWidth
            />
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button variant="contained" sx={{ borderRadius: '999px' }}>投稿する</Button>
        </Box>
    </Box>
  );
}
