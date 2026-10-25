
import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@grpc/grpc-js";
import * as grpc_web_1 from "grpc-web";
export class ProcessPaymentRequest extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        order_id?: number;
        amount?: number;
        payment_method?: string;
        card_number?: string;
        card_expiry?: string;
        card_cvv?: string;
        blik_code?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("order_id" in data && data.order_id != undefined) {
                this.order_id = data.order_id;
            }
            if ("amount" in data && data.amount != undefined) {
                this.amount = data.amount;
            }
            if ("payment_method" in data && data.payment_method != undefined) {
                this.payment_method = data.payment_method;
            }
            if ("card_number" in data && data.card_number != undefined) {
                this.card_number = data.card_number;
            }
            if ("card_expiry" in data && data.card_expiry != undefined) {
                this.card_expiry = data.card_expiry;
            }
            if ("card_cvv" in data && data.card_cvv != undefined) {
                this.card_cvv = data.card_cvv;
            }
            if ("blik_code" in data && data.blik_code != undefined) {
                this.blik_code = data.blik_code;
            }
        }
    }
    get order_id() {
        return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
    }
    set order_id(value: number) {
        pb_1.Message.setField(this, 1, value);
    }
    get amount() {
        return pb_1.Message.getFieldWithDefault(this, 2, 0) as number;
    }
    set amount(value: number) {
        pb_1.Message.setField(this, 2, value);
    }
    get payment_method() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set payment_method(value: string) {
        pb_1.Message.setField(this, 3, value);
    }
    get card_number() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set card_number(value: string) {
        pb_1.Message.setField(this, 4, value);
    }
    get card_expiry() {
        return pb_1.Message.getFieldWithDefault(this, 5, "") as string;
    }
    set card_expiry(value: string) {
        pb_1.Message.setField(this, 5, value);
    }
    get card_cvv() {
        return pb_1.Message.getFieldWithDefault(this, 6, "") as string;
    }
    set card_cvv(value: string) {
        pb_1.Message.setField(this, 6, value);
    }
    get blik_code() {
        return pb_1.Message.getFieldWithDefault(this, 7, "") as string;
    }
    set blik_code(value: string) {
        pb_1.Message.setField(this, 7, value);
    }
    static fromObject(data: {
        order_id?: number;
        amount?: number;
        payment_method?: string;
        card_number?: string;
        card_expiry?: string;
        card_cvv?: string;
        blik_code?: string;
    }): ProcessPaymentRequest {
        const message = new ProcessPaymentRequest({});
        if (data.order_id != null) {
            message.order_id = data.order_id;
        }
        if (data.amount != null) {
            message.amount = data.amount;
        }
        if (data.payment_method != null) {
            message.payment_method = data.payment_method;
        }
        if (data.card_number != null) {
            message.card_number = data.card_number;
        }
        if (data.card_expiry != null) {
            message.card_expiry = data.card_expiry;
        }
        if (data.card_cvv != null) {
            message.card_cvv = data.card_cvv;
        }
        if (data.blik_code != null) {
            message.blik_code = data.blik_code;
        }
        return message;
    }
    toObject() {
        const data: {
            order_id?: number;
            amount?: number;
            payment_method?: string;
            card_number?: string;
            card_expiry?: string;
            card_cvv?: string;
            blik_code?: string;
        } = {};
        if (this.order_id != null) {
            data.order_id = this.order_id;
        }
        if (this.amount != null) {
            data.amount = this.amount;
        }
        if (this.payment_method != null) {
            data.payment_method = this.payment_method;
        }
        if (this.card_number != null) {
            data.card_number = this.card_number;
        }
        if (this.card_expiry != null) {
            data.card_expiry = this.card_expiry;
        }
        if (this.card_cvv != null) {
            data.card_cvv = this.card_cvv;
        }
        if (this.blik_code != null) {
            data.blik_code = this.blik_code;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.order_id != 0)
            writer.writeInt32(1, this.order_id);
        if (this.amount != 0)
            writer.writeDouble(2, this.amount);
        if (this.payment_method.length)
            writer.writeString(3, this.payment_method);
        if (this.card_number.length)
            writer.writeString(4, this.card_number);
        if (this.card_expiry.length)
            writer.writeString(5, this.card_expiry);
        if (this.card_cvv.length)
            writer.writeString(6, this.card_cvv);
        if (this.blik_code.length)
            writer.writeString(7, this.blik_code);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ProcessPaymentRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new ProcessPaymentRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.order_id = reader.readInt32();
                    break;
                case 2:
                    message.amount = reader.readDouble();
                    break;
                case 3:
                    message.payment_method = reader.readString();
                    break;
                case 4:
                    message.card_number = reader.readString();
                    break;
                case 5:
                    message.card_expiry = reader.readString();
                    break;
                case 6:
                    message.card_cvv = reader.readString();
                    break;
                case 7:
                    message.blik_code = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): ProcessPaymentRequest {
        return ProcessPaymentRequest.deserialize(bytes);
    }
}
export class ProcessPaymentResponse extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        success?: boolean;
        transaction_id?: string;
        message?: string;
        payment_status?: string;
        processed_at?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("success" in data && data.success != undefined) {
                this.success = data.success;
            }
            if ("transaction_id" in data && data.transaction_id != undefined) {
                this.transaction_id = data.transaction_id;
            }
            if ("message" in data && data.message != undefined) {
                this.message = data.message;
            }
            if ("payment_status" in data && data.payment_status != undefined) {
                this.payment_status = data.payment_status;
            }
            if ("processed_at" in data && data.processed_at != undefined) {
                this.processed_at = data.processed_at;
            }
        }
    }
    get success() {
        return pb_1.Message.getFieldWithDefault(this, 1, false) as boolean;
    }
    set success(value: boolean) {
        pb_1.Message.setField(this, 1, value);
    }
    get transaction_id() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set transaction_id(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get message() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set message(value: string) {
        pb_1.Message.setField(this, 3, value);
    }
    get payment_status() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set payment_status(value: string) {
        pb_1.Message.setField(this, 4, value);
    }
    get processed_at() {
        return pb_1.Message.getFieldWithDefault(this, 5, "") as string;
    }
    set processed_at(value: string) {
        pb_1.Message.setField(this, 5, value);
    }
    static fromObject(data: {
        success?: boolean;
        transaction_id?: string;
        message?: string;
        payment_status?: string;
        processed_at?: string;
    }): ProcessPaymentResponse {
        const message = new ProcessPaymentResponse({});
        if (data.success != null) {
            message.success = data.success;
        }
        if (data.transaction_id != null) {
            message.transaction_id = data.transaction_id;
        }
        if (data.message != null) {
            message.message = data.message;
        }
        if (data.payment_status != null) {
            message.payment_status = data.payment_status;
        }
        if (data.processed_at != null) {
            message.processed_at = data.processed_at;
        }
        return message;
    }
    toObject() {
        const data: {
            success?: boolean;
            transaction_id?: string;
            message?: string;
            payment_status?: string;
            processed_at?: string;
        } = {};
        if (this.success != null) {
            data.success = this.success;
        }
        if (this.transaction_id != null) {
            data.transaction_id = this.transaction_id;
        }
        if (this.message != null) {
            data.message = this.message;
        }
        if (this.payment_status != null) {
            data.payment_status = this.payment_status;
        }
        if (this.processed_at != null) {
            data.processed_at = this.processed_at;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.success != false)
            writer.writeBool(1, this.success);
        if (this.transaction_id.length)
            writer.writeString(2, this.transaction_id);
        if (this.message.length)
            writer.writeString(3, this.message);
        if (this.payment_status.length)
            writer.writeString(4, this.payment_status);
        if (this.processed_at.length)
            writer.writeString(5, this.processed_at);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ProcessPaymentResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new ProcessPaymentResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.success = reader.readBool();
                    break;
                case 2:
                    message.transaction_id = reader.readString();
                    break;
                case 3:
                    message.message = reader.readString();
                    break;
                case 4:
                    message.payment_status = reader.readString();
                    break;
                case 5:
                    message.processed_at = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): ProcessPaymentResponse {
        return ProcessPaymentResponse.deserialize(bytes);
    }
}
export abstract class UnimplementedPaymentServiceService {
    static definition = {
        ProcessPayment: {
            path: "/carpartshop.payment.PaymentService/ProcessPayment",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: ProcessPaymentRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => ProcessPaymentRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: ProcessPaymentResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => ProcessPaymentResponse.deserialize(new Uint8Array(bytes))
        }
    };
    [method: string]: grpc_1.UntypedHandleCall;
    abstract ProcessPayment(call: grpc_1.ServerUnaryCall<ProcessPaymentRequest, ProcessPaymentResponse>, callback: grpc_1.sendUnaryData<ProcessPaymentResponse>): void;
}
export class PaymentServiceClient {
    private _address: string;
    private _client: grpc_web_1.GrpcWebClientBase;
    constructor(address: string, credentials?: Object, options?: grpc_web_1.GrpcWebClientBaseOptions) {
        if (!options)
            options = {};
        options.format = options.format || "text";
        this._address = address;
        this._client = new grpc_web_1.GrpcWebClientBase(options);
    }
    private static ProcessPayment = new grpc_web_1.MethodDescriptor<ProcessPaymentRequest, ProcessPaymentResponse>("/carpartshop.payment.PaymentService/ProcessPayment", grpc_web_1.MethodType.UNARY, ProcessPaymentRequest, ProcessPaymentResponse, (message: ProcessPaymentRequest) => message.serialize(), ProcessPaymentResponse.deserialize);
    ProcessPayment(message: ProcessPaymentRequest, metadata: grpc_web_1.Metadata | null) {
        return this._client.thenableCall<ProcessPaymentRequest, ProcessPaymentResponse>(this._address + "/carpartshop.payment.PaymentService/ProcessPayment", message, metadata || {}, PaymentServiceClient.ProcessPayment);
    }
}
