import * as React from 'react';
import PostCard, { PostCardProps } from './PostCard';
import PostForm from './PostForm';
import { Box, Typography } from '@mui/material';

// The actual posts data would come from props or a data fetching hook.
const posts: PostCardProps[] = [];

export default function Timeline() {
  return (
    <Box>
      <PostForm />
      <Box sx={{ mt: 2 }}>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))
        ) : (
          <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
            まだ投稿がありません。
          </Typography>
        )}
      </Box>
    </Box>
  );
}
