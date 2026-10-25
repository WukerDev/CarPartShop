import { describe, it, expect, vi } from 'vitest';
import {
  grpcWebClient,
  catalogGrpcClient,
  orderGrpcClient,
  paymentGrpcClient
} from '@/services/grpcWebClient';
import {
  CatalogServiceClient,
  OrderServiceClient,
  PaymentServiceClient,
  CategoryModel,
  CreateOrderRequest,
  OrderItemInput,
  OrderResponse,
  GetCategoriesResponse,
  GetPartsResponse,
  GetPartByIdResponse,
  GetOrdersResponse,
  GetOrderByIdRequest,
  RequestReturnResponse,
  ProcessPaymentResponse
} from '@/clients/generated';

describe('gRPC-Web generated classes and clients from protoc-gen-ts', () => {
  it('instantiates client classes correctly with RPC methods', () => {
    expect(catalogGrpcClient).toBeInstanceOf(CatalogServiceClient);
    expect(orderGrpcClient).toBeInstanceOf(OrderServiceClient);
    expect(paymentGrpcClient).toBeInstanceOf(PaymentServiceClient);

    expect(typeof catalogGrpcClient.GetCategories).toBe('function');
    expect(typeof catalogGrpcClient.GetParts).toBe('function');
    expect(typeof catalogGrpcClient.GetPartById).toBe('function');

    expect(typeof orderGrpcClient.CreateOrder).toBe('function');
    expect(typeof orderGrpcClient.GetOrders).toBe('function');
    expect(typeof orderGrpcClient.RequestReturn).toBe('function');

    expect(typeof paymentGrpcClient.ProcessPayment).toBe('function');
  });

  it('instantiates message class, serializes to binary and deserializes back', () => {
    const cat = new CategoryModel({
      id: 42,
      name: 'Układ Wydechowy',
      slug: 'wydech',
      description: 'Tłumiki i katalizatory',
      icon: 'mdi-pipe',
      parts_count: 15
    });

    expect(cat.id).toBe(42);
    expect(cat.name).toBe('Układ Wydechowy');
    expect(cat.parts_count).toBe(15);

    const bytes = cat.serialize();
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(0);

    const decoded = CategoryModel.deserialize(bytes);
    expect(decoded.id).toBe(42);
    expect(decoded.name).toBe('Układ Wydechowy');
    expect(decoded.slug).toBe('wydech');
    expect(decoded.parts_count).toBe(15);
  });

  it('supports fromObject and toObject helpers on generated classes', () => {
    const item = new OrderItemInput({
      part_id: 10,
      quantity: 2
    });

    const orderReq = new CreateOrderRequest({
      customer_name: 'Jan Tester',
      email: 'jan@test.local',
      phone: '+48123456789',
      shipping_address: 'ul. Testowa 1',
      payment_method: 'Card',
      items: [item]
    });

    expect(orderReq.customer_name).toBe('Jan Tester');
    expect(orderReq.items[0].part_id).toBe(10);
    expect(orderReq.items[0].quantity).toBe(2);

    const obj = orderReq.toObject();
    const cloned = CreateOrderRequest.fromObject(obj);
    expect(cloned.customer_name).toBe('Jan Tester');
    expect(cloned.items[0].part_id).toBe(10);
  });

  it('provides typed wrapper methods on grpcWebClient service', async () => {
    const mockCatRes = new GetCategoriesResponse();
    const catSpy = vi.spyOn(grpcWebClient.catalog, 'GetCategories').mockResolvedValue(mockCatRes);
    const catResult = await grpcWebClient.getCategories('dummy-token');
    expect(catSpy).toHaveBeenCalled();
    expect(catResult).toBe(mockCatRes);

    const mockPartsRes = new GetPartsResponse();
    const partsSpy = vi.spyOn(grpcWebClient.catalog, 'GetParts').mockResolvedValue(mockPartsRes);
    const partsResult = await grpcWebClient.getParts({ categoryId: 1, search: 'filtr' });
    expect(partsSpy).toHaveBeenCalled();
    expect(partsResult).toBe(mockPartsRes);

    const mockPartRes = new GetPartByIdResponse();
    const partSpy = vi.spyOn(grpcWebClient.catalog, 'GetPartById').mockResolvedValue(mockPartRes);
    const partResult = await grpcWebClient.getPartById(5);
    expect(partSpy).toHaveBeenCalled();
    expect(partResult).toBe(mockPartRes);

    const mockCreateOrderRes = new OrderResponse();
    const createOrderSpy = vi.spyOn(grpcWebClient.orders, 'CreateOrder').mockResolvedValue(mockCreateOrderRes);
    const orderResult = await grpcWebClient.createOrder({
      customerName: 'Jan',
      email: 'jan@local.com',
      phone: '123456789',
      shippingAddress: 'Adres',
      paymentMethod: 'BLIK',
      items: [{ partId: 1, quantity: 2 }]
    });
    expect(createOrderSpy).toHaveBeenCalled();
    expect(orderResult).toBe(mockCreateOrderRes);

    const mockOrdersRes = new GetOrdersResponse();
    const ordersSpy = vi.spyOn(grpcWebClient.orders, 'GetOrders').mockResolvedValue(mockOrdersRes);
    const ordersResult = await grpcWebClient.getOrders({ email: 'jan@local.com' });
    expect(ordersSpy).toHaveBeenCalled();
    expect(ordersResult).toBe(mockOrdersRes);

    const mockOrderRes = new OrderResponse();
    const orderSpy = vi.spyOn(grpcWebClient.orders, 'GetOrderById').mockResolvedValue(mockOrderRes);
    const orderSingleResult = await grpcWebClient.getOrderById(12);
    expect(orderSpy).toHaveBeenCalled();
    expect(orderSingleResult).toBe(mockOrderRes);

    const mockReturnRes = new RequestReturnResponse();
    const returnSpy = vi.spyOn(grpcWebClient.orders, 'RequestReturn').mockResolvedValue(mockReturnRes);
    const returnResult = await grpcWebClient.requestReturn({ orderId: 12, reason: 'Uszkodzone' });
    expect(returnSpy).toHaveBeenCalled();
    expect(returnResult).toBe(mockReturnRes);

    const mockPayRes = new ProcessPaymentResponse();
    const paySpy = vi.spyOn(grpcWebClient.payments, 'ProcessPayment').mockResolvedValue(mockPayRes);
    const payResult = await grpcWebClient.processPayment({ orderId: 12, amount: 99.99, paymentMethod: 'BLIK', blikCode: '123456' });
    expect(paySpy).toHaveBeenCalled();
    expect(payResult).toBe(mockPayRes);
  });
});
