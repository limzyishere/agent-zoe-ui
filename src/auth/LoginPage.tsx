import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    try {
      await login(username, password);
      navigate("/contacts");
    } catch {
      setError("Invalid username or password");
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f7fa",
      }}
    >
      <Card sx={{ width: 360 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" textAlign="center">
              Property CRM
            </Typography>

            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography color="error">
                {error}
              </Typography>
            )}

            <Button variant="contained" onClick={handleSubmit}>
              Login
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
