import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // 認証チェック
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { authName } = body;

        if (!authName) {
            return NextResponse.json({ error: 'authName is required' }, { status: 400 });
        }

        // ユーザーの名前を更新
        await prisma.user.upsert({
            where: { id: user.id },
            update: {
                name: authName,
            },
            create: {
                id: user.id,
                email: user.email || '',
                name: authName,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating user name:', error);
        return NextResponse.json(
            { error: 'Failed to update user name' },
            { status: 500 }
        );
    }
}
