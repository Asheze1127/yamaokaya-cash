import * as React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  CardMedia,
  Box
} from '@mui/material';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';

export interface PostCardProps {
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  createdAt: string;
}

export default function PostCard({ post }: { post: PostCardProps }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: red[500] }} src={post.user.avatar}>{post.user.name.charAt(0)}</Avatar>}
        action={<IconButton aria-label="settings"><MoreVertIcon /></IconButton>}
        title={post.user.name}
        subheader={post.createdAt}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.content}
        </Typography>
      </CardContent>
      {post.image && (
        <CardMedia
          component="img"
          height="300"
          image={post.image}
          alt="Post image"
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardActions disableSpacing>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <IconButton aria-label="add to favorites">
                <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="comment">
                <ChatBubbleOutlineIcon />
            </IconButton>
            <IconButton aria-label="retweet">
                <RepeatIcon />
            </IconButton>
            <IconButton aria-label="share">
                <ShareIcon />
            </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}
