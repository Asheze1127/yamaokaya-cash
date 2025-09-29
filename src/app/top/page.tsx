'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PostForm from '@/components/top/PostForm';
import Timeline from '@/components/top/Timeline';
import { Box, Container, CircularProgress } from '@mui/material';
import Header from '@/components/header/header';
import { User } from '@supabase/supabase-js';
export default function TopPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('User error:', error);
          router.push('/');
          return;
        }

        if (!user) {
          console.log('No user found, redirecting to home');
          router.push('/');
          return;
        }

        console.log('User found:', user.email);
        setUser(user);

        // Fire-and-forget request to correct the user's name in the public table
        fetch('/api/user/correct-name', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ authName: user.user_metadata.name }),
        });

      } catch (error) {
        console.error('Failed to get user:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const onLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null; // リダイレクト中
  }

  return (
    <>
      <Header onLogout={onLogout} />
      <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <PostForm />
        <Box sx={{ mt: 5, borderTop: '1px solid #eee', pt: 5 }}>
          <Timeline />
        </Box>
      </Container>
    </>
  );
}
