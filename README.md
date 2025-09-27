# 🍜 Yamaoka Best SNS

「最高の山岡家体験」をシェアする SNS アプリです。  
ユーザーは **麺の硬さ／脂の量／味の濃さ（Enum）** を指定し、**食前・食後の写真**をアップロードして投稿します。  
食後写真の画像認識で「飲み干し」判定を行い、**サステナブルポイント**を付与します。  
投稿には **いいね** と **コメント** ができます。

---

## 🏗 技術スタック

- [Next.js 13+ App Router](https://nextjs.org/)
- [React 18](https://reactjs.org/)
- [Prisma](https://www.prisma.io/) (Supabase PostgreSQL)
- [Supabase](https://supabase.com/) (DB・認証・ストレージ)
- [MUI](https://mui.com/) (UIコンポーネント)

---

## 📂 ディレクトリ構成

├── prisma
│ ├── schema.prisma # Prisma スキーマ
│ └── migrations # マイグレーション履歴
│ ├── 20250926132654_init
│ └── 20250926134150_add_comments
├── public # 画像などの静的ファイル
└── src
├── app # Next.js App Router ページ
├── components
│ ├── atoms # UI原子コンポーネント
│ └── login # ログイン関連コンポーネント
├── lib
│ └── prisma.ts # PrismaClient シングルトン
└── supabase # Supabaseクライアントやヘルパー


---

## 🗂 データベース設計（概要）

- **User**  
  名前・メールアドレス・サステナブルポイント
- **Post**  
  麺の硬さ・脂の量・味の濃さ（enum）／食前・食後写真（必須）／サステナブル判定ステート（`STAY`/`TRUE`/`FALSE`）
- **Like**  
  User と Post の中間テーブル（いいね管理）
- **Comment**  
  投稿に対するコメント（ユーザー・本文・スレッド対応可能）

---

## 🚀 セットアップ

### 1. 依存関係インストール

```bash
npm install
2. Supabase 接続設定

.env に Supabase の接続 URL を設定します：

DATABASE_URL="postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres"

3. Prisma マイグレーション反映
npx prisma migrate dev --name init

4. Prisma Client 生成
npx prisma generate

5. 開発サーバー起動
npm run dev


ブラウザで http://localhost:3000 にアクセス。

💡 主な機能

ユーザー登録 / ログイン（Supabase Auth）

投稿（麺の硬さ・脂の量・味の濃さ・写真）

飲み干し判定（画像認識連携）

サステナブルポイント付与

投稿へのいいね / コメント

ランキング・プロフィールページ（今後実装予定）

📜 Prisma コマンド
# DB反映（マイグレーション）
npx prisma migrate dev --name <name>

# 既存DBからスキーマ反映
npx prisma db pull

# クライアント生成
npx prisma generate

# 管理画面
npx prisma studio
