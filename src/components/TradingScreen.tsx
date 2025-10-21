import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import CoinPrice from "./CoinPrice";
import ManualTrading from "./ManualTrading";
import AutoTrading from "./AutoTrading";
import type { TradingScreenProps, UpbitMarket } from "../types";

const TradingScreen: React.FC<TradingScreenProps> = ({ api, onLogout }) => {
  const [selectedMarket, setSelectedMarket] = useState<string>("KRW-BTC");
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [markets, setMarkets] = useState<UpbitMarket[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchMarkets();
    fetchCurrentPrice();
  }, []);

  useEffect(() => {
    if (selectedMarket) {
      fetchCurrentPrice();
    }
  }, [selectedMarket]);

  const fetchMarkets = async () => {
    try {
      const response = await fetch("https://api.upbit.com/v1/market/all");
      const data = await response.json();
        const krwMarkets = data.filter((market: any) =>
          market.market.startsWith("KRW-")
        );
      setMarkets(krwMarkets);
    } catch (error) {
      console.error("마켓 조회 오류:", error);
      setError("마켓 정보를 불러올 수 없습니다.");
    }
  };

  const fetchCurrentPrice = async () => {
    try {
      const response = await fetch(
        `https://api.upbit.com/v1/ticker?markets=${selectedMarket}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setCurrentPrice(data[0].trade_price);
      }
    } catch (error) {
      console.error("가격 조회 오류:", error);
    }
  };

  const handleLogout = () => {
    // API 키는 저장되지 않으므로 별도 삭제 불필요
    onLogout();
  };

  return (
    <Box>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            코인트레이딩
          </Typography>
          <FormControl sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel>코인 선택</InputLabel>
            <Select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              label='코인 선택'
            >
              {markets.map((market) => (
                <MenuItem key={market.market} value={market.market}>
                  {market.korean_name} ({market.market})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            color='inherit'
            onClick={handleLogout}
            startIcon={<ExitToApp />}
          >
            로그아웃
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth='lg' sx={{ mt: 3, mb: 3 }}>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 실시간 가격 */}
          <CoinPrice market={selectedMarket} />

          {/* 거래 패널 */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* 수동 거래 */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <ManualTrading
                api={api}
                market={selectedMarket}
                currentPrice={currentPrice}
              />
            </Box>

            {/* 자동 거래 */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <AutoTrading
                api={api}
                market={selectedMarket}
                currentPrice={currentPrice}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TradingScreen;
