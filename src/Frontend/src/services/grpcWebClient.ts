import {
  CatalogServiceClient,
  OrderServiceClient,
  PaymentServiceClient,
  GetCategoriesRequest,
  GetCategoriesResponse,
  GetPartsRequest,
  GetPartsResponse,
  GetPartByIdRequest,
  GetPartByIdResponse,
  CreateOrderRequest,
  OrderResponse,
  GetOrdersRequest,
  GetOrdersResponse,
  GetOrderByIdRequest,
  RequestReturnRequest,
  RequestReturnResponse,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  CategoryModel,
  CarPartModel,
  OrderItemModel,
  OrderItemInput
} from '@/clients/generated';

export {
  CatalogServiceClient,
  OrderServiceClient,
  PaymentServiceClient,
  GetCategoriesRequest,
  GetCategoriesResponse,
  GetPartsRequest,
  GetPartsResponse,
  GetPartByIdRequest,
  GetPartByIdResponse,
  CreateOrderRequest,
  OrderResponse,
  GetOrdersRequest,
  GetOrdersResponse,
  GetOrderByIdRequest,
  RequestReturnRequest,
  RequestReturnResponse,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  CategoryModel,
  CarPartModel,
  OrderItemModel,
  OrderItemInput
};

export class GrpcWebClient {
  private hostname: string;
  public readonly catalog: CatalogServiceClient;
  public readonly orders: OrderServiceClient;
  public readonly payments: PaymentServiceClient;

  constructor(hostname = '') {
    this.hostname = hostname;
    this.catalog = new CatalogServiceClient(hostname);
    this.orders = new OrderServiceClient(hostname);
    this.payments = new PaymentServiceClient(hostname);
  }

  async getCategories(token?: string): Promise<GetCategoriesResponse> {
    const meta: Record<string, string> = {};
    if (token) meta['Authorization'] = `Bearer ${token}`;
    return this.catalog.GetCategories(new GetCategoriesRequest(), meta);
  }

  async getParts(params?: { categoryId?: number; search?: string; minPrice?: number; maxPrice?: number; inStockOnly?: boolean }, token?: string): Promise<GetPartsResponse> {
    const meta: Record<string, string> = {};
    if (token) meta['Authorization'] = `Bearer ${token}`;
    const req = new GetPartsRequest({
      category_id: params?.categoryId,
      search: params?.search,
      min_price: params?.minPrice,
      max_price: params?.maxPrice,
      in_stock_only: params?.inStockOnly
    });
    return this.catalog.GetParts(req, meta);
  }

  async getPartById(id: number, token?: string): Promise<GetPartByIdResponse> {
    const meta: Record<string, string> = {};
    if (token) meta['Authorization'] = `Bearer ${token}`;
    const req = new GetPartByIdRequest({ id });
    return this.catalog.GetPartById(req, meta);
  }

  async createOrder(payload: { customerName: string; email: string; phone: string; shippingAddress: string; paymentMethod: string; items: { partId: number; quantity: number }[] }, token?: string): Promise<OrderResponse> {
    const meta: Record<string, string> = {};
    if (token) meta['Authorization'] = `Bearer ${token}`;
    const req = new CreateOrderRequest({
      customer_name: payload.customerName,
      email: payload.email,
      phone: payload.phone,
      shipping_address: payload.shippingAddress,
      payment_method: payload.paymentMethod,
      items: payload.items.map(i => new OrderItemInput({ part_id: i.partId, quantity: i.quantity }))
    });
    return this.orders.CreateOrder(req, meta);
  }

  async getOrders(params?: { userId?: string; email?: string }, token?: string): Promise<GetOrdersResponse> {
    const meta: Record<string, string> = {};
    if (token) meta['Authorization'] = `Bearer ${token}`;
    const req = new GetOrdersRequest({
      user_id: params?.userId,
      email: params?.email
    });
    return this.orders.GetOrders(req, meta);
  }

  async getOrderById(id: number, token?: string): Promise<OrderResponse> {
    const meta: Record<string, string> = {};
    if (token) meta['Authorization'] = `Bearer ${token}`;
    const req = new GetOrderByIdRequest({ id });
    return this.orders.GetOrderById(req, meta);
  }

  async requestReturn(payload: { orderId: number; reason: string; comments?: string }, token?: string): Promise<RequestReturnResponse> {
    const meta: Record<string, string> = {};
    if (token) meta['Authorization'] = `Bearer ${token}`;
    const req = new RequestReturnRequest({
      order_id: payload.orderId,
      reason: payload.reason,
      comments: payload.comments
    });
    return this.orders.RequestReturn(req, meta);
  }

  async processPayment(payload: { orderId: number; amount: number; paymentMethod: string; cardNumber?: string; cardExpiry?: string; cardCvv?: string; blikCode?: string }, token?: string): Promise<ProcessPaymentResponse> {
    const meta: Record<string, string> = {};
    if (token) meta['Authorization'] = `Bearer ${token}`;
    const req = new ProcessPaymentRequest({
      order_id: payload.orderId,
      amount: payload.amount,
      payment_method: payload.paymentMethod,
      card_number: payload.cardNumber,
      card_expiry: payload.cardExpiry,
      card_cvv: payload.cardCvv,
      blik_code: payload.blikCode
    });
    return this.payments.ProcessPayment(req, meta);
  }

  async invokeRpc<TReq, TRes>(
    service: string,
    method: string,
    requestPayload: TReq,
    serializer: (req: TReq) => Uint8Array,
    deserializer: (bytes: Uint8Array) => TRes,
    token?: string
  ): Promise<TRes> {
    const url = `${this.hostname}/${service}/${method}`;
    const rawBytes = serializer(requestPayload);
    const framed = new Uint8Array(5 + rawBytes.length);
    framed[0] = 0;
    const len = rawBytes.length;
    framed[1] = (len >> 24) & 0xff;
    framed[2] = (len >> 16) & 0xff;
    framed[3] = (len >> 8) & 0xff;
    framed[4] = len & 0xff;
    framed.set(rawBytes, 5);

    const headers: Record<string, string> = {
      'Content-Type': 'application/grpc-web+proto',
      'X-Grpc-Web': '1',
      'X-User-Agent': 'grpc-web-javascript/0.1'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: framed
    });

    if (!response.ok) {
      throw new Error(`gRPC call failed with status ${response.status}: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (bytes.length >= 5) {
      const msgBytes = bytes.slice(5);
      return deserializer(msgBytes);
    }

    return deserializer(bytes);
  }
}

export const grpcWebClient = new GrpcWebClient();
export const catalogGrpcClient = grpcWebClient.catalog;
export const orderGrpcClient = grpcWebClient.orders;
export const paymentGrpcClient = grpcWebClient.payments;
