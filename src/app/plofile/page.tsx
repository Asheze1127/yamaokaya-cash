'use client';

import { Box, Container } from "@mui/material"

import Header from "@/components/header/header"
import PostForm from "@/components/top/PostForm"
import Timeline from "@/components/top/Timeline"
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import LeftSidebar from "@/components/top/LeftSidebar";

export default function ProfilePage() {
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
                <div>Loading...</div>
            </Box>
        );
    }

    if (!user) {
        return null; // リダイレクト中
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Box
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    width: { sm: '200px' },
                    flexShrink: 0
                }}
            >
                <LeftSidebar />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Box sx={{ flexShrink: 0 }}>
                    <Header onLogout={onLogout} />
                </Box>
                <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                    <PostForm />
                    <Box sx={{ mt: 5, borderTop: '1px solid #eee', pt: 5 }}>
                        <Timeline />
                    </Box>
                </Container>
            </Box>
        </Box>
    )
}
