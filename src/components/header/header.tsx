import { Box, Button, Typography } from "@mui/material";

export default function Header(){
    return (
        <Box sx={{ maxWidth: 1900, margin: 'auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography>yamaokaya-cash</Typography>
            <Button>ログアウト</Button>
        </Box>
    )
}