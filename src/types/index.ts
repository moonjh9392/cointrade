// 업비트 API 관련 타입 정의
export interface UpbitAccount {
  currency: string;
  balance: string;
  locked: string;
  avg_buy_price: string;
  avg_buy_price_modified: boolean;
  unit_currency: string;
}

export interface UpbitTicker {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_date_kst: string;
  trade_time_kst: string;
  trade_timestamp: number;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;
  change: 'RISE' | 'FALL' | 'EVEN';
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;
  trade_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  timestamp: number;
}

export interface UpbitMarket {
  market: string;
  korean_name: string;
  english_name: string;
  market_warning: 'NONE' | 'CAUTION';
}

export interface UpbitOrder {
  uuid: string;
  side: 'bid' | 'ask';
  ord_type: 'limit' | 'price' | 'market';
  price: string;
  state: string;
  market: string;
  created_at: string;
  volume: string;
  remaining_volume: string;
  reserved_fee: string;
  remaining_fee: string;
  paid_fee: string;
  locked: string;
  executed_volume: string;
  trades_count: number;
}

export interface UpbitOrderRequest {
  market: string;
  side: 'bid' | 'ask';
  volume?: string;
  price?: string;
  ord_type: 'limit' | 'price' | 'market';
}

// 컴포넌트 Props 타입
export interface ApiKeyFormProps {
  onApiKeyVerified: (api: any) => void;
}

export interface TradingScreenProps {
  api: any;
  onLogout: () => void;
}

export interface CoinPriceProps {
  market?: string;
}

export interface ManualTradingProps {
  api: any;
  market: string;
  currentPrice: number | null;
}

export interface AutoTradingProps {
  api: any;
  market: string;
  currentPrice: number | null;
}

// 자동 주문 타입
export interface AutoOrder {
  id: number;
  side: 'bid' | 'ask';
  volume: string;
  price: string;
  percentage: number;
  isActive: boolean;
}

// 업비트 API 클래스 타입은 실제 클래스를 import해서 사용
