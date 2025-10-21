import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { UpbitAPI } from "../config/upbit";
import type { ApiKeyFormProps } from "../types";

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onApiKeyVerified }) => {
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const api = new UpbitAPI(accessKey, secretKey);
      const accounts = await api.getAccounts();

      if (accounts && accounts.length > 0) {
        // API 키가 유효함 (저장하지 않음 - 보안상 안전)
        onApiKeyVerified(api);
      } else {
        setError("API 키가 유효하지 않거나 계좌 정보를 가져올 수 없습니다.");
      }
    } catch (err) {
      setError("API 키 인증에 실패했습니다. 키를 다시 확인해주세요.");
      console.error("API 인증 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant='h4' component='h1' gutterBottom align='center'>
            코인트레이딩
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            align='center'
            sx={{ mb: 3 }}
          >
            업비트 API 키를 입력하여 시작하세요
          </Typography>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label='Access Key'
              type='password'
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              margin='normal'
              required
              helperText='업비트에서 발급받은 Access Key를 입력하세요'
            />
            <TextField
              fullWidth
              label='Secret Key'
              type='password'
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              margin='normal'
              required
              helperText='업비트에서 발급받은 Secret Key를 입력하세요'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              size='large'
              disabled={loading || !accessKey || !secretKey}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "API 키 인증"}
            </Button>
          </form>

          <Typography
            variant='body2'
            color='text.secondary'
            align='center'
            sx={{ mt: 2 }}
          >
            API 키는 업비트 웹사이트의 마이페이지 → Open API에서 발급받을 수 있습니다.
          </Typography>
          <Typography
            variant='body2'
            color='warning.main'
            align='center'
            sx={{ mt: 1, fontWeight: 'bold' }}
          >
            🔒 보안: API 키는 브라우저에 저장되지 않으며, 매번 새로 입력해야 합니다.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ApiKeyForm;
