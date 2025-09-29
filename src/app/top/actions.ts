'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const prisma = new PrismaClient();

// Type for initial post creation (without image URLs)
interface CreatePostArgs {
  noodleHard: 'HARD' | 'NORMAL' | 'SOFT';
  oilAmount: 'EXTRA' | 'NORMAL' | 'LESS';
  tasteLevel: 'STRONG' | 'NORMAL' | 'LIGHT';
  comment?: string;
}

// 1. Create post record and return its ID
export async function createPost(args: CreatePostArgs): Promise<{ id: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    // ユーザーが存在しない場合は作成
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown User',
      },
    });

    const newPost = await prisma.post.create({
      data: {
        userId: user.id,
        noodleHard: args.noodleHard,
        oilAmount: args.oilAmount,
        tasteLevel: args.tasteLevel,
        comment: args.comment,
        photoBefore: '',
        photoAfter: '',
      },
      select: {
        id: true, // Only return the new post's ID
      },
    });
    return newPost;
  } catch (error) {
    console.error('Error creating post record:', error);
    throw new Error('Failed to create post record.');
  }
}

// Type for updating the post with image URLs
interface UpdatePostWithImagesArgs {
  postId: string;
  photoBefore: string;
  photoAfter: string;
}

// 2. Update post with image URLs
export async function updatePostWithImages(args: UpdatePostWithImagesArgs) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    // ユーザーが存在しない場合は作成
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown User',
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: args.postId },
      select: { userId: true },
    });

    if (!post || post.userId !== user.id) {
      throw new Error('Unauthorized: You do not own this post.');
    }

    await prisma.post.update({
      where: { id: args.postId },
      data: {
        photoBefore: args.photoBefore,
        photoAfter: args.photoAfter,
      },
    });

    revalidatePath('/top');
  } catch (error) {
    console.error('Error updating post with images:', error);
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      throw error;
    }
    throw new Error('Failed to update post with images.');
  }
}
