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
  Box,
  Chip
} from '@mui/material';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import { Post } from '@/types'; // Import the shared Post type

// Helper function to format the date
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

const customizationLabels = {
  noodleHard: {
    HARD: '麺硬め',
    NORMAL: '麺普通',
    SOFT: '麺柔らかめ',
  },
  oilAmount: {
    EXTRA: '脂多め',
    NORMAL: '脂普通',
    LESS: '脂少なめ',
  },
  tasteLevel: {
    STRONG: '味濃いめ',
    NORMAL: '味普通',
    LIGHT: '味薄め',
  },
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: red[500] }}>{post.user.name.charAt(0)}</Avatar>}
        action={<IconButton aria-label="settings"><MoreVertIcon /></IconButton>}
        title={post.user.name}
        subheader={formatDate(post.createdAt)}
      />
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Box sx={{ flex: 1 }}>
          <CardMedia
            component="img"
            height="300"
            image={post.photoBefore}
            alt="Before eating"
            sx={{ objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <CardMedia
            component="img"
            height="300"
            image={post.photoAfter}
            alt="After eating"
            sx={{ objectFit: 'cover' }}
          />
        </Box>
      </Box>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Chip label={customizationLabels.noodleHard[post.noodleHard as keyof typeof customizationLabels.noodleHard]} size="small" />
          <Chip label={customizationLabels.oilAmount[post.oilAmount as keyof typeof customizationLabels.oilAmount]} size="small" />
          <Chip label={customizationLabels.tasteLevel[post.tasteLevel as keyof typeof customizationLabels.tasteLevel]} size="small" />
        </Box>
        {post.comment && (
          <Typography variant="body2" color="text.secondary">
            {post.comment}
          </Typography>
        )}
      </CardContent>
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
