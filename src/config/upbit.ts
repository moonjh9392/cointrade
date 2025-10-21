import CryptoJS from "crypto-js";
import type { UpbitAccount, UpbitTicker, UpbitOrder } from "../types";

// 업비트 API 설정
export const UPBIT_CONFIG = {
  BASE_URL: "https://api.upbit.com",
  WS_URL: "wss://api.upbit.com/websocket/v1",

  // API 엔드포인트
  ENDPOINTS: {
    ACCOUNTS: "/v1/accounts",
    ORDERS: "/v1/orders",
    ORDER_BOOK: "/v1/orderbook",
    TICKER: "/v1/ticker",
    CANDLES: "/v1/candles",
    MARKETS: "/v1/market/all",
  },
} as const;

// 업비트 API 클라이언트
export class UpbitAPI {
  public accessKey: string;
  public secretKey: string;
  public baseURL: string;

  constructor(accessKey: string, secretKey: string) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.baseURL = UPBIT_CONFIG.BASE_URL;
  }

  // JWT 토큰 생성
  private generateJWT(payload: any): string {
    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    const encodedHeader = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(JSON.stringify(header))
    )
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const encodedPayload = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(JSON.stringify(payload))
    )
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const signature = CryptoJS.HmacSHA256(
      `${encodedHeader}.${encodedPayload}`,
      this.secretKey
    );
    const encodedSignature = CryptoJS.enc.Base64.stringify(signature)
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  // API 요청 헤더 생성
  private getAuthHeaders(queryString: string = ""): Record<string, string> {
    const payload: any = {
      access_key: this.accessKey,
      nonce: Date.now().toString(),
    };

    if (queryString) {
      payload.query_hash = CryptoJS.SHA256(queryString).toString();
      payload.query_hash_alg = "SHA256";
    }

    const token = this.generateJWT(payload);
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // 계좌 정보 조회
  async getAccounts(): Promise<UpbitAccount[]> {
    const headers = this.getAuthHeaders();
    const response = await fetch(
      `${this.baseURL}${UPBIT_CONFIG.ENDPOINTS.ACCOUNTS}`,
      {
        headers,
      }
    );
    return response.json();
  }

  // 주문하기
  async placeOrder(
    market: string,
    side: string,
    volume: number,
    price: number | null,
    ord_type: string
  ): Promise<UpbitOrder> {
    const queryString = `market=${market}&side=${side}&volume=${volume}&price=${price}&ord_type=${ord_type}`;
    const headers = this.getAuthHeaders(queryString);

    const response = await fetch(
      `${this.baseURL}${UPBIT_CONFIG.ENDPOINTS.ORDERS}`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          market,
          side,
          volume,
          price,
          ord_type,
        }),
      }
    );
    return response.json();
  }

  // 시세 조회
  async getTicker(markets: string[]): Promise<UpbitTicker[]> {
    const marketParam = markets.join(",");
    const response = await fetch(
      `${this.baseURL}${UPBIT_CONFIG.ENDPOINTS.TICKER}?markets=${marketParam}`
    );
    return response.json();
  }

  // 호가 조회
  async getOrderBook(markets: string[]): Promise<any[]> {
    const marketParam = markets.join(",");
    const response = await fetch(
      `${this.baseURL}${UPBIT_CONFIG.ENDPOINTS.ORDER_BOOK}?markets=${marketParam}`
    );
    return response.json();
  }
}
