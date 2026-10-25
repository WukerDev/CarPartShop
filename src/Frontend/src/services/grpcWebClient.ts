export class GrpcWebClient {
  private hostname: string;

  constructor(hostname = '') {
    this.hostname = hostname;
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
