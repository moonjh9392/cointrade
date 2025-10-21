import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import type { ManualTradingProps } from "../types";

const ManualTrading: React.FC<ManualTradingProps> = ({ api, market, currentPrice }) => {
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [side, setSide] = useState<"bid" | "ask">("bid");
  const [volume, setVolume] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const orderData = {
        market,
        side,
        volume: parseFloat(volume),
        price: orderType === "market" ? null : parseFloat(price),
        ord_type: orderType === "market" ? "market" : "limit",
      };

      const result = await api.placeOrder(
        orderData.market,
        orderData.side,
        orderData.volume,
        orderData.price,
        orderData.ord_type
      );

      if (result.uuid) {
        setMessage(
          `${
            side === "bid" ? "매수" : "매도"
          } 주문이 성공적으로 접수되었습니다.`
        );
        setVolume("");
        setPrice("");
      } else {
        setMessage("주문 접수에 실패했습니다.");
      }
      } catch (error) {
        setMessage(`주문 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        console.error("주문 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (value: string) => {
    setPrice(value);
  };

  const setCurrentPrice = () => {
    if (currentPrice) {
      setPrice(currentPrice.toString());
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          수동 거래
        </Typography>

        {message && (
          <Alert
            severity={message.includes("성공") ? "success" : "error"}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>거래 유형</InputLabel>
              <Select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as "limit" | "market")}
              >
                <MenuItem value='limit'>지정가</MenuItem>
                <MenuItem value='market'>시장가</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>거래 방향</InputLabel>
              <Select value={side} onChange={(e) => setSide(e.target.value as "bid" | "ask")}>
                <MenuItem value='bid'>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TrendingUp sx={{ mr: 1, color: "success.main" }} />
                    매수
                  </Box>
                </MenuItem>
                <MenuItem value='ask'>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TrendingDown sx={{ mr: 1, color: "error.main" }} />
                    매도
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label='수량'
              type='number'
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              required
              helperText='거래할 수량을 입력하세요'
            />

            {orderType === "limit" && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  label='가격'
                  type='number'
                  value={price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  required
                  helperText='거래할 가격을 입력하세요'
                />
                <Button
                  variant='outlined'
                  onClick={setCurrentPrice}
                  disabled={!currentPrice}
                >
                  현재가
                </Button>
              </Box>
            )}

            <Button
              type='submit'
              fullWidth
              variant='contained'
              size='large'
              disabled={
                loading || !volume || (orderType === "limit" && !price)
              }
              color={side === "bid" ? "success" : "error"}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                `${side === "bid" ? "매수" : "매도"} 주문`
              )}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualTrading;
