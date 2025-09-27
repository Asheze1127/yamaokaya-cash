import { Box, Button, Typography } from "@mui/material";

interface HeaderProps {
    onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
    return (
        <Box sx={{ maxWidth: 1900, margin: 'auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography>yamaokaya-cash</Typography>
            <Button onClick={onLogout}>ログアウト</Button>
        </Box>
    )
}