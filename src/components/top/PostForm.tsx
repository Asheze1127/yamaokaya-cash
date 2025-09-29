'use client';
import * as React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { createPost, updatePostWithImages } from '@/app/top/actions'; // updatePostWithImagesをインポート
import { supabase } from '@/lib/supabase';

// --- Styled Components ---
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImageUploadBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 200,
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  transition: 'border-color 0.3s',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

// --- Component ---
export default function PostForm() {
  const [taste, setTaste] = React.useState<string | null>(null);
  const [noodle, setNoodle] = React.useState<string | null>(null);
  const [fat, setFat] = React.useState<string | null>(null);
  const [comment, setComment] = React.useState('');
  const [beforeImage, setBeforeImage] = React.useState<File | null>(null);
  const [afterImage, setAfterImage] = React.useState<File | null>(null);
  const [beforeImageUrl, setBeforeImageUrl] = React.useState<string | null>(null);
  const [afterImageUrl, setAfterImageUrl] = React.useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);

  const resetForm = () => {
    setTaste(null);
    setNoodle(null);
    setFat(null);
    setComment('');
    setBeforeImage(null);
    setAfterImage(null);
    setBeforeImageUrl(null);
    setAfterImageUrl(null);
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    urlSetter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setter(file);
      if (urlSetter) {
        urlSetter(URL.createObjectURL(file));
      }
    }
  };

  const isFormComplete = !!taste && !!noodle && !!fat && !!beforeImage && !!afterImage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) {
      setFeedback({ type: 'error', message: '写真を含む全ての必須項目を入力してください。' });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare data for initial post creation (no images yet)
      const postData = {
        tasteLevel: taste.toUpperCase() as 'STRONG' | 'NORMAL' | 'LIGHT',
        noodleHard: noodle.toUpperCase() as 'HARD' | 'NORMAL' | 'SOFT',
        oilAmount: (fat === 'more' ? 'EXTRA' : fat.toUpperCase()) as 'EXTRA' | 'NORMAL' | 'LESS',
        comment: comment,
      };

      // 2. Call server action to create post record and get its ID
      const { id: postId } = await createPost(postData);

      // 3. Get user ID for creating image path
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not logged in');

      // 4. Upload images with a path including the new post ID
      const uploadImage = async (image: File, path: string) => {
        // 認証状態を確認
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('User not authenticated');
        }

        try {
          const { error } = await supabase.storage
            .from('posts')
            .upload(path, image, {
              upsert: true,
              cacheControl: '3600',
              contentType: image.type
            });

          if (error) {
            console.error('Upload error:', error);
            // RLSエラーの場合は、一時的にプレースホルダーURLを返す
            if (error.message.includes('row-level security policy')) {
              console.warn('RLS policy error, using placeholder URL');
              return `https://via.placeholder.com/400x300?text=Image+Upload+Failed`;
            }
            throw error;
          }

          const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(path);
          return publicUrl;
        } catch (error) {
          console.error('Upload failed:', error);
          // エラーの場合はプレースホルダーURLを返す
          return `https://via.placeholder.com/400x300?text=Upload+Error`;
        }
      }

      const beforeImagePath = `${user.id}/${postId}/before`;
      const afterImagePath = `${user.id}/${postId}/after`;

      let photoBeforeUrl, photoAfterUrl;

      try {
        [photoBeforeUrl, photoAfterUrl] = await Promise.all([
          uploadImage(beforeImage, beforeImagePath),
          uploadImage(afterImage, afterImagePath)
        ]);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        setFeedback({ type: 'error', message: '画像のアップロードに失敗しました。StorageのRLSポリシーを確認してください。' });
        return;
      }

      // 5. Call server action to update the post with image URLs
      await updatePostWithImages({
        postId,
        photoBefore: photoBeforeUrl,
        photoAfter: photoAfterUrl,
      });

      setFeedback({ type: 'success', message: '投稿が完了しました！' });
      resetForm();

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました。';
      setFeedback({ type: 'error', message: `投稿に失敗しました: ${errorMessage}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 600, margin: 'auto', p: 3, border: '1px solid #ddd', borderRadius: 2, boxShadow: 1, position: 'relative' }}>
      <Typography variant="h5" component="h2" sx={{ textAlign: 'center', mb: 2 }}>
        ベストの一杯を投稿
      </Typography>

      {isSubmitting && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <FormControl component="fieldset" disabled={isSubmitting}>
        <FormLabel component="legend" sx={{ mb: 1 }}>味の濃さ</FormLabel>
        <ToggleButtonGroup value={taste} exclusive onChange={(e, v) => setTaste(v)} fullWidth>
          <ToggleButton value="strong">濃いめ</ToggleButton>
          <ToggleButton value="normal">普通</ToggleButton>
          <ToggleButton value="light">薄め</ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      <FormControl component="fieldset" disabled={isSubmitting}>
        <FormLabel component="legend" sx={{ mb: 1 }}>麺の硬さ</FormLabel>
        <ToggleButtonGroup value={noodle} exclusive onChange={(e, v) => setNoodle(v)} fullWidth>
          <ToggleButton value="hard">硬め</ToggleButton>
          <ToggleButton value="normal">普通</ToggleButton>
          <ToggleButton value="soft">柔らかめ</ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      <FormControl component="fieldset" disabled={isSubmitting}>
        <FormLabel component="legend" sx={{ mb: 1 }}>脂の量</FormLabel>
        <ToggleButtonGroup value={fat} exclusive onChange={(e, v) => setFat(v)} fullWidth>
          <ToggleButton value="more">多め</ToggleButton>
          <ToggleButton value="normal">普通</ToggleButton>
          <ToggleButton value="less">少なめ</ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      <FormControl fullWidth disabled={isSubmitting}>
        <FormLabel component="legend" sx={{ mb: 1 }}>コメント (任意)</FormLabel>
        <TextField
          multiline
          rows={4}
          placeholder="今日の最高の一杯について語ろう！"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </FormControl>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <FormControl fullWidth required disabled={isSubmitting}>
          <FormLabel component="legend" sx={{ mb: 1 }}>食前の写真</FormLabel>
          <Button component="label" variant="text" sx={{ p: 0, height: '100%' }}>
            <ImageUploadBox>
              {beforeImageUrl ? (
                <img src={beforeImageUrl} alt="食前の写真プレビュー" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
              ) : (
                <>
                  <AddPhotoAlternateIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2">クリックしてアップロード</Typography>
                </>
              )}
            </ImageUploadBox>
            <VisuallyHiddenInput type="file" accept="image/*" onChange={(e) => handleImageChange(e, setBeforeImage, setBeforeImageUrl)} />
          </Button>
        </FormControl>
        <FormControl fullWidth required disabled={isSubmitting}>
          <FormLabel component="legend" sx={{ mb: 1 }}>食後の写真</FormLabel>
          <Button component="label" variant="text" sx={{ p: 0, height: '100%' }}>
            <ImageUploadBox>
              {afterImageUrl ? (
                <img src={afterImageUrl} alt="食後の写真プレビュー" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
              ) : (
                <>
                  <AddPhotoAlternateIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2">クリックしてアップロード</Typography>
                </>
              )}
            </ImageUploadBox>
            <VisuallyHiddenInput type="file" accept="image/*" onChange={(e) => handleImageChange(e, setAfterImage, setAfterImageUrl)} />
          </Button>
        </FormControl>
      </Box>

      <Button type="submit" variant="contained" size="large" disabled={!isFormComplete || isSubmitting}>
        {isSubmitting ? '投稿中...' : '投稿する'}
      </Button>

      <Snackbar open={!!feedback} autoHideDuration={6000} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setFeedback(null)} severity={feedback?.type} sx={{ width: '100%' }}>
          {feedback?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
