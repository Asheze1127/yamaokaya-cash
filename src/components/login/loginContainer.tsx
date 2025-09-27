import { Button, TextField, Typography, Container, Box, Card, CardContent, Stack } from "@mui/material";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface LoginContainerProps {
    isSignIn: boolean;
    setSignIn: (isSignIn: boolean) => void;
}

export default function LoginContainer({ isSignIn, setSignIn }: LoginContainerProps) {
    const router = useRouter();

    const changeSignIn = () => {
        setSignIn(!isSignIn);
    }

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [loginError, setLoginError] = useState<string>('');

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmitSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginError('');

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })
            if (signInError) {
                throw signInError;
            }

            // ログイン成功後、セッションが確立されるまで少し待機
            if (data.session) {
                // セッションが確立されるまで少し待機
                await new Promise(resolve => setTimeout(resolve, 100));
                // ページをリロードしてセッションを確実に同期
                window.location.href = "/top";
            } else {
                // セッションが即座に取得できない場合、少し待ってから再試行
                await new Promise(resolve => setTimeout(resolve, 500));
                const { data: retryData } = await supabase.auth.getSession();
                if (retryData.session) {
                    window.location.href = "/top";
                } else {
                    router.push("/top");
                }
            }
        } catch (error: any) {
            console.log(error);
            if (error.message?.includes('Invalid login credentials')) {
                setLoginError('メールアドレスまたはパスワードが正しくありません');
            } else {
                setLoginError('ログインに失敗しました。もう一度お試しください');
            }
        }
    }

    const handleSubmitSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // メールアドレスバリデーション
        if (!validateEmail(email)) {
            setEmailError('正しいメールアドレスを入力してください');
            return;
        }
        setEmailError('');

        // パスワードバリデーション
        if (password.length < 6) {
            setPasswordError('パスワードは6文字以上で入力してください');
            return;
        }
        setPasswordError('');

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name,
                    },
                },
            })
            if (signUpError) {
                throw signUpError;
            }
            alert('登録完了メールを確認してください');
        } catch (error) {
            alert('エラーが発生しました');
            console.log(error);
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 64px)',
            }}
        >
            <Container component="main" maxWidth="xs">
                <Card sx={{ width: '100%', padding: 2 }}>
                    <CardContent>
                        <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
                            {isSignIn ? "ログイン" : "新規登録"}
                        </Typography>
                        {loginError && (
                            <Typography color="error" align="center" sx={{ mb: 2 }}>
                                {loginError}
                            </Typography>
                        )}
                        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={isSignIn ? handleSubmitSignIn : handleSubmitSignUp}>
                            <Stack spacing={2}>
                                {!isSignIn && <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="名前"
                                    name="name"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />}
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="メールアドレス"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (emailError) setEmailError('');
                                    }}
                                    error={!!emailError}
                                    helperText={emailError}
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="パスワード"
                                    type="password"
                                    id="password"
                                    autoComplete="off"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (passwordError) setPasswordError('');
                                    }}
                                    error={!!passwordError}
                                    helperText={passwordError}
                                    slotProps={{
                                        input: {
                                            autoCapitalize: 'none',
                                            autoCorrect: 'off',
                                            spellCheck: 'false'
                                        }
                                    }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    {isSignIn ? "ログイン" : "新規登録"}
                                </Button>
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="text"
                                    onClick={changeSignIn}
                                >
                                    {isSignIn ? "新規登録はこちら" : "ログインはこちら"}
                                </Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
