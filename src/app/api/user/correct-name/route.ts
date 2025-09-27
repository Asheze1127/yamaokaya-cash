import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { authName } = await request.json();

  if (!authName) {
    return NextResponse.json({ error: 'authName is required' }, { status: 400 });
  }

  try {
    const userInDb = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { name: true },
    });

    if (userInDb && userInDb.name !== authName) {
      await prisma.user.update({
        where: { id: authUser.id },
        data: { name: authName },
      });
      return NextResponse.json({ message: 'Name corrected' });
    }

    return NextResponse.json({ message: 'Name is already correct' });
  } catch (error) {
    console.error('Error correcting user name:', error);
    return NextResponse.json({ error: 'Failed to correct user name' }, { status: 500 });
  }
}
