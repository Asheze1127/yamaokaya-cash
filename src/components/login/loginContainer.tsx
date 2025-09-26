import { Button, TextField, Typography } from "@mui/material";

export default function LoginContainer() {
  return (
    <div>
      <form>
        <Typography variant="h6">ログイン</Typography>
        <TextField label="メールアドレス" type="email" />
        <TextField label="パスワード" type="password" />
        <Button type="submit">ログイン</Button>
      </form>
    </div>
  );
}