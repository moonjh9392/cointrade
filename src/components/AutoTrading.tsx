import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { Add, Remove, TrendingUp, TrendingDown } from "@mui/icons-material";
import type { AutoTradingProps, AutoOrder } from "../types";

const AutoTrading: React.FC<AutoTradingProps> = ({ currentPrice }) => {
  const [autoOrders, setAutoOrders] = useState<AutoOrder[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const addAutoOrder = () => {
    const newOrder: AutoOrder = {
      id: Date.now(),
      side: "bid",
      volume: "",
      price: "",
      percentage: 0,
      isActive: false,
    };
    setAutoOrders([...autoOrders, newOrder]);
  };

  const removeAutoOrder = (id: number) => {
    setAutoOrders(autoOrders.filter((order) => order.id !== id));
  };

  const updateAutoOrder = (id: number, field: keyof AutoOrder, value: string | number | boolean) => {
    setAutoOrders(
      autoOrders.map((order) =>
        order.id === id ? { ...order, [field]: value } : order
      )
    );
  };

  const calculatePrice = (percentage: number): number => {
    if (!currentPrice) return 0;
    return currentPrice * (1 + percentage / 100);
  };

  const handleStartAutoTrading = () => {
    const activeOrders = autoOrders.filter((order) => order.isActive);
    if (activeOrders.length === 0) {
      setMessage("활성화된 자동 주문이 없습니다.");
      return;
    }

    setIsActive(true);
    setMessage(`${activeOrders.length}개의 자동 주문이 활성화되었습니다.`);
  };

  const handleStopAutoTrading = () => {
    setIsActive(false);
    setMessage("자동 거래가 중지되었습니다.");
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant='h6'>자동 거래 설정</Typography>
          <Box>
            <Button
              variant='contained'
              color='success'
              onClick={addAutoOrder}
              startIcon={<Add />}
              sx={{ mr: 1 }}
            >
              주문 추가
            </Button>
            <Button
              variant={isActive ? "outlined" : "contained"}
              color={isActive ? "error" : "primary"}
              onClick={
                isActive ? handleStopAutoTrading : handleStartAutoTrading
              }
            >
              {isActive ? "중지" : "시작"}
            </Button>
          </Box>
        </Box>

        {message && (
          <Alert
            severity={message.includes("활성화") ? "success" : "info"}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        {autoOrders.length === 0 ? (
          <Typography color='text.secondary' align='center' sx={{ py: 4 }}>
            자동 주문을 추가해주세요
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {autoOrders.map((order, index) => (
              <Card variant='outlined' key={order.id}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant='subtitle1'>
                      {index + 1}차 주문
                    </Typography>
                    <Box>
                      <Chip
                        label={order.isActive ? "활성" : "비활성"}
                        color={order.isActive ? "success" : "default"}
                        size='small'
                        sx={{ mr: 1 }}
                      />
                      <IconButton
                        onClick={() => removeAutoOrder(order.id)}
                        color='error'
                        size='small'
                      >
                        <Remove />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel>거래 방향</InputLabel>
                        <Select
                          value={order.side}
                          onChange={(e) =>
                            updateAutoOrder(order.id, "side", e.target.value as "bid" | "ask")
                          }
                        >
                          <MenuItem value='bid'>
                            <Box
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <TrendingUp
                                sx={{ mr: 1, color: "success.main" }}
                              />
                              매수
                            </Box>
                          </MenuItem>
                          <MenuItem value='ask'>
                            <Box
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <TrendingDown
                                sx={{ mr: 1, color: "error.main" }}
                              />
                              매도
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        label='수량'
                        type='number'
                        value={order.volume}
                        onChange={(e) =>
                          updateAutoOrder(order.id, "volume", e.target.value)
                        }
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        fullWidth
                        label='가격 조정 (%)'
                        type='number'
                        value={order.percentage}
                        onChange={(e) =>
                          updateAutoOrder(
                            order.id,
                            "percentage",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        helperText={`계산된 가격: ${calculatePrice(
                          order.percentage
                        ).toLocaleString()}원`}
                      />

                      <TextField
                        fullWidth
                        label='고정 가격'
                        type='number'
                        value={order.price}
                        onChange={(e) =>
                          updateAutoOrder(order.id, "price", e.target.value)
                        }
                        helperText='고정 가격을 입력하면 % 조정 무시'
                      />
                    </Box>

                    <Button
                      fullWidth
                      variant={order.isActive ? "outlined" : "contained"}
                      color={order.isActive ? "error" : "primary"}
                      onClick={() =>
                        updateAutoOrder(
                          order.id,
                          "isActive",
                          !order.isActive
                        )
                      }
                    >
                      {order.isActive ? "비활성화" : "활성화"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AutoTrading;
