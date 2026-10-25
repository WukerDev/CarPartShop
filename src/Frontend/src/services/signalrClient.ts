import * as signalR from '@microsoft/signalr';

type OrderStatusCallback = (orderId: number, status: string, message: string) => void;
type StockUpdateCallback = (partId: number, newStock: number) => void;
type ReturnUpdateCallback = (orderId: number, returnStatus: string, message: string) => void;
type OrderPlacedCallback = (orderId: number, customerName: string, total: number) => void;

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private orderStatusListeners: OrderStatusCallback[] = [];
  private stockUpdateListeners: StockUpdateCallback[] = [];
  private returnUpdateListeners: ReturnUpdateCallback[] = [];
  private orderPlacedListeners: OrderPlacedCallback[] = [];

  public async startConnection(token?: string | null): Promise<void> {
    if (this.connection) {
      return;
    }

    const hubUrl = '/hubs/shop';
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token || localStorage.getItem('carpart_token') || '',
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.on('ReceiveOrderStatusChanged', (orderId: number, status: string, message: string) => {
      this.orderStatusListeners.forEach(cb => cb(orderId, status, message));
    });

    this.connection.on('ReceiveStockUpdate', (partId: number, newStock: number) => {
      this.stockUpdateListeners.forEach(cb => cb(partId, newStock));
    });

    this.connection.on('ReceiveReturnUpdate', (orderId: number, returnStatus: string, message: string) => {
      this.returnUpdateListeners.forEach(cb => cb(orderId, returnStatus, message));
    });

    this.connection.on('ReceiveOrderPlaced', (orderId: number, customerName: string, total: number) => {
      this.orderPlacedListeners.forEach(cb => cb(orderId, customerName, total));
    });

    try {
      await this.connection.start();
      console.log('[SignalR] Połączono z hubem sklepu.');
    } catch (err) {
      console.warn('[SignalR] Błąd połączenia z hubem (ponowienie nastąpi automatycznie):', err);
    }
  }

  public onOrderStatusChanged(cb: OrderStatusCallback): () => void {
    this.orderStatusListeners.push(cb);
    return () => {
      this.orderStatusListeners = this.orderStatusListeners.filter(l => l !== cb);
    };
  }

  public onStockUpdate(cb: StockUpdateCallback): () => void {
    this.stockUpdateListeners.push(cb);
    return () => {
      this.stockUpdateListeners = this.stockUpdateListeners.filter(l => l !== cb);
    };
  }

  public onReturnUpdate(cb: ReturnUpdateCallback): () => void {
    this.returnUpdateListeners.push(cb);
    return () => {
      this.returnUpdateListeners = this.returnUpdateListeners.filter(l => l !== cb);
    };
  }

  public onOrderPlaced(cb: OrderPlacedCallback): () => void {
    this.orderPlacedListeners.push(cb);
    return () => {
      this.orderPlacedListeners = this.orderPlacedListeners.filter(l => l !== cb);
    };
  }

  public async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }
}

export const signalRService = new SignalRService();
