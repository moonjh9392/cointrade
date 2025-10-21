import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ApiKeyForm from "./components/ApiKeyForm";
import TradingScreen from "./components/TradingScreen";
import { UpbitAPI } from "./config/upbit";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  const [api, setApi] = useState<UpbitAPI | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 세션 관리: 페이지 새로고침 시 자동 로그아웃
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 페이지를 떠날 때 API 키 정보 초기화
      setApi(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleApiKeyVerified = (verifiedApi: UpbitAPI) => {
    setApi(verifiedApi);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setApi(null);
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthenticated ? (
        <TradingScreen api={api!} onLogout={handleLogout} />
      ) : (
        <ApiKeyForm onApiKeyVerified={handleApiKeyVerified} />
      )}
    </ThemeProvider>
  );
}

export default App;