import { Button, TextField, Typography } from "@mui/material";

interface LoginContainerProps {
    isSignIn: boolean;
    setSignIn: (isSignIn: boolean) => void;
}

export default function LoginContainer({ isSignIn, setSignIn }: LoginContainerProps) {
    const changeSignIn = () => {
        setSignIn(!isSignIn);
    }
    return (
        <div>
            <form>
                <Typography variant="h6">{isSignIn ? "ログイン" : "新規登録"}</Typography>
                <TextField label="メールアドレス" type="email" />
                <TextField label="パスワード" type="password" />
                <Button type="submit">{isSignIn ? "ログイン" : "新規登録"}</Button>
                <Button type="button" onClick={() => changeSignIn()}>{isSignIn ? "新規登録はこちら" : "ログインはこちら"}</Button>
            </form>
        </div>
    );
}