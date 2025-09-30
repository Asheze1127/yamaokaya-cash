import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

export async function POST() {
    try {
        const posts = await prisma.post.findMany({
            where: { sustainable: 'STAY' },
            take: 50,
            include: { user: true },
        })

        let processed = 0
        let lastResponse = ''
        const errors: string[] = []

        // モデルを一度だけ作成
        const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' })

        for (const post of posts) {
            try {
                console.log('Processing post:', post.id, 'Image URL:', post.photoAfter)

                const prompt = 'この写真が完飲ならTRUE、そうでなければFALSEだけ返してください。完飲判定は汚れまで全て食べ切るのは不可能なのでスープが少しだけ残ってるという状態は完飲と判定してください。'

                // 画像を Base64 に変換
                const imageResponse = await fetch(post.photoAfter)
                const imageBuffer = await imageResponse.arrayBuffer()
                const imageBase64 = Buffer.from(imageBuffer).toString('base64')

                // 生成リクエスト
                const result = await model.generateContent([
                    { text: prompt },
                    { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
                ])

                const answer = result.response.text().trim().toUpperCase()
                const sustainable = answer.includes('TRUE') ? 'TRUE' : 'FALSE'
                lastResponse = answer

                // DB 更新
                await prisma.post.update({
                    where: { id: post.id },
                    data: {
                        sustainable: sustainable as 'TRUE' | 'FALSE',
                        ...(sustainable === 'TRUE' && {
                            user: { update: { sustainablePoints: { increment: 1 } } },
                        }),
                    },
                })

                processed++
            } catch (err: unknown) {
                const errorMsg = `Post ${post.id}: ${err instanceof Error ? err.message : String(err)}`
                errors.push(errorMsg)

                if (err instanceof Error && (err.message?.includes('quota') || (err as { response?: { status?: number } }).response?.status === 429)) {
                    console.warn('Quota exceeded, stop processing.')
                    break
                }
            }
        }

        return NextResponse.json({
            processed,
            remaining: posts.length - processed,
            lastAIResponse: lastResponse,
            errors,
        })
    } catch (error) {
        console.error('Error fetching posts:', error)
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }
}
