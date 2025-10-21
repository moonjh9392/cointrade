import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import type { CoinPriceProps, UpbitTicker } from "../types";

const CoinPrice: React.FC<CoinPriceProps> = ({ market = "KRW-BTC" }) => {
  const [priceData, setPriceData] = useState<UpbitTicker | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          `https://api.upbit.com/v1/ticker?markets=${market}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setPriceData(data[0]);
        }
      } catch (error) {
        console.error("가격 조회 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();

    // 1초마다 가격 업데이트
    const interval = setInterval(fetchPrice, 1000);

    return () => clearInterval(interval);
  }, [market]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>가격 정보를 불러오는 중...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!priceData) {
    return (
      <Card>
        <CardContent>
          <Typography color='error'>가격 정보를 불러올 수 없습니다.</Typography>
        </CardContent>
      </Card>
    );
  }

  const {
    trade_price,
    change,
    change_rate,
    change_price,
    high_price,
    low_price,
    acc_trade_volume_24h,
  } = priceData;

  const isPositive = change === "RISE";
  const changeColor = isPositive ? "success" : "error";
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant='h6' component='h2' sx={{ mr: 1 }}>
            {market}
          </Typography>
          <Chip
            icon={<ChangeIcon />}
            label={`${isPositive ? "+" : ""}${(change_rate * 100).toFixed(2)}%`}
            color={changeColor}
            size='small'
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant='h4' color={changeColor}>
              {trade_price.toLocaleString()}원
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {isPositive ? "+" : ""}
              {change_price.toLocaleString()}원
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant='body2' color='text.secondary'>
              고가: {high_price.toLocaleString()}원
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              저가: {low_price.toLocaleString()}원
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              24h 거래량: {acc_trade_volume_24h.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CoinPrice;
