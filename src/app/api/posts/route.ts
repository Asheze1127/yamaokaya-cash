import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const supabase = await createClient();

        // 認証チェック
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 投稿データを取得（ユーザー情報も含める）
        const posts = await prisma.post.findMany({
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    const { id } = await request.json();
    const post = await prisma.post.delete({
        where: { id },
    });
    return NextResponse.json(post);
}