'use client';
import * as React from 'react';
import Timeline from '@/components/top/Timeline';
import Header from '@/components/header/header';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function TopPage() {
    const router = useRouter();
    const onLogout = () => {
        supabase.auth.signOut();
        router.push('/');
        router.refresh();
    }
    return(
        <>
            <Header onLogout={onLogout} />
            <Timeline />
        </>
    )
}
