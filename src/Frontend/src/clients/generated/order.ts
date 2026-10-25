
import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@grpc/grpc-js";
import * as grpc_web_1 from "grpc-web";
export class OrderItemInput extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        part_id?: number;
        quantity?: number;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("part_id" in data && data.part_id != undefined) {
                this.part_id = data.part_id;
            }
            if ("quantity" in data && data.quantity != undefined) {
                this.quantity = data.quantity;
            }
        }
    }
    get part_id() {
        return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
    }
    set part_id(value: number) {
        pb_1.Message.setField(this, 1, value);
    }
    get quantity() {
        return pb_1.Message.getFieldWithDefault(this, 2, 0) as number;
    }
    set quantity(value: number) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        part_id?: number;
        quantity?: number;
    }): OrderItemInput {
        const message = new OrderItemInput({});
        if (data.part_id != null) {
            message.part_id = data.part_id;
        }
        if (data.quantity != null) {
            message.quantity = data.quantity;
        }
        return message;
    }
    toObject() {
        const data: {
            part_id?: number;
            quantity?: number;
        } = {};
        if (this.part_id != null) {
            data.part_id = this.part_id;
        }
        if (this.quantity != null) {
            data.quantity = this.quantity;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.part_id != 0)
            writer.writeInt32(1, this.part_id);
        if (this.quantity != 0)
            writer.writeInt32(2, this.quantity);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): OrderItemInput {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new OrderItemInput();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.part_id = reader.readInt32();
                    break;
                case 2:
                    message.quantity = reader.readInt32();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): OrderItemInput {
        return OrderItemInput.deserialize(bytes);
    }
}
export class CreateOrderRequest extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        customer_name?: string;
        email?: string;
        phone?: string;
        shipping_address?: string;
        payment_method?: string;
        items?: OrderItemInput[];
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [6], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("customer_name" in data && data.customer_name != undefined) {
                this.customer_name = data.customer_name;
            }
            if ("email" in data && data.email != undefined) {
                this.email = data.email;
            }
            if ("phone" in data && data.phone != undefined) {
                this.phone = data.phone;
            }
            if ("shipping_address" in data && data.shipping_address != undefined) {
                this.shipping_address = data.shipping_address;
            }
            if ("payment_method" in data && data.payment_method != undefined) {
                this.payment_method = data.payment_method;
            }
            if ("items" in data && data.items != undefined) {
                this.items = data.items;
            }
        }
    }
    get customer_name() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set customer_name(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get email() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set email(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get phone() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set phone(value: string) {
        pb_1.Message.setField(this, 3, value);
    }
    get shipping_address() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set shipping_address(value: string) {
        pb_1.Message.setField(this, 4, value);
    }
    get payment_method() {
        return pb_1.Message.getFieldWithDefault(this, 5, "") as string;
    }
    set payment_method(value: string) {
        pb_1.Message.setField(this, 5, value);
    }
    get items() {
        return pb_1.Message.getRepeatedWrapperField(this, OrderItemInput, 6) as OrderItemInput[];
    }
    set items(value: OrderItemInput[]) {
        pb_1.Message.setRepeatedWrapperField(this, 6, value);
    }
    static fromObject(data: {
        customer_name?: string;
        email?: string;
        phone?: string;
        shipping_address?: string;
        payment_method?: string;
        items?: ReturnType<typeof OrderItemInput.prototype.toObject>[];
    }): CreateOrderRequest {
        const message = new CreateOrderRequest({});
        if (data.customer_name != null) {
            message.customer_name = data.customer_name;
        }
        if (data.email != null) {
            message.email = data.email;
        }
        if (data.phone != null) {
            message.phone = data.phone;
        }
        if (data.shipping_address != null) {
            message.shipping_address = data.shipping_address;
        }
        if (data.payment_method != null) {
            message.payment_method = data.payment_method;
        }
        if (data.items != null) {
            message.items = data.items.map(item => OrderItemInput.fromObject(item));
        }
        return message;
    }
    toObject() {
        const data: {
            customer_name?: string;
            email?: string;
            phone?: string;
            shipping_address?: string;
            payment_method?: string;
            items?: ReturnType<typeof OrderItemInput.prototype.toObject>[];
        } = {};
        if (this.customer_name != null) {
            data.customer_name = this.customer_name;
        }
        if (this.email != null) {
            data.email = this.email;
        }
        if (this.phone != null) {
            data.phone = this.phone;
        }
        if (this.shipping_address != null) {
            data.shipping_address = this.shipping_address;
        }
        if (this.payment_method != null) {
            data.payment_method = this.payment_method;
        }
        if (this.items != null) {
            data.items = this.items.map((item: OrderItemInput) => item.toObject());
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.customer_name.length)
            writer.writeString(1, this.customer_name);
        if (this.email.length)
            writer.writeString(2, this.email);
        if (this.phone.length)
            writer.writeString(3, this.phone);
        if (this.shipping_address.length)
            writer.writeString(4, this.shipping_address);
        if (this.payment_method.length)
            writer.writeString(5, this.payment_method);
        if (this.items.length)
            writer.writeRepeatedMessage(6, this.items, (item: OrderItemInput) => item.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): CreateOrderRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new CreateOrderRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.customer_name = reader.readString();
                    break;
                case 2:
                    message.email = reader.readString();
                    break;
                case 3:
                    message.phone = reader.readString();
                    break;
                case 4:
                    message.shipping_address = reader.readString();
                    break;
                case 5:
                    message.payment_method = reader.readString();
                    break;
                case 6:
                    reader.readMessage(message.items, () => pb_1.Message.addToRepeatedWrapperField(message, 6, OrderItemInput.deserialize(reader), OrderItemInput));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): CreateOrderRequest {
        return CreateOrderRequest.deserialize(bytes);
    }
}
export class OrderItemModel extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        id?: number;
        part_id?: number;
        part_name?: string;
        part_number?: string;
        quantity?: number;
        unit_price?: number;
        total_price?: number;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("id" in data && data.id != undefined) {
                this.id = data.id;
            }
            if ("part_id" in data && data.part_id != undefined) {
                this.part_id = data.part_id;
            }
            if ("part_name" in data && data.part_name != undefined) {
                this.part_name = data.part_name;
            }
            if ("part_number" in data && data.part_number != undefined) {
                this.part_number = data.part_number;
            }
            if ("quantity" in data && data.quantity != undefined) {
                this.quantity = data.quantity;
            }
            if ("unit_price" in data && data.unit_price != undefined) {
                this.unit_price = data.unit_price;
            }
            if ("total_price" in data && data.total_price != undefined) {
                this.total_price = data.total_price;
            }
        }
    }
    get id() {
        return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
    }
    set id(value: number) {
        pb_1.Message.setField(this, 1, value);
    }
    get part_id() {
        return pb_1.Message.getFieldWithDefault(this, 2, 0) as number;
    }
    set part_id(value: number) {
        pb_1.Message.setField(this, 2, value);
    }
    get part_name() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set part_name(value: string) {
        pb_1.Message.setField(this, 3, value);
    }
    get part_number() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set part_number(value: string) {
        pb_1.Message.setField(this, 4, value);
    }
    get quantity() {
        return pb_1.Message.getFieldWithDefault(this, 5, 0) as number;
    }
    set quantity(value: number) {
        pb_1.Message.setField(this, 5, value);
    }
    get unit_price() {
        return pb_1.Message.getFieldWithDefault(this, 6, 0) as number;
    }
    set unit_price(value: number) {
        pb_1.Message.setField(this, 6, value);
    }
    get total_price() {
        return pb_1.Message.getFieldWithDefault(this, 7, 0) as number;
    }
    set total_price(value: number) {
        pb_1.Message.setField(this, 7, value);
    }
    static fromObject(data: {
        id?: number;
        part_id?: number;
        part_name?: string;
        part_number?: string;
        quantity?: number;
        unit_price?: number;
        total_price?: number;
    }): OrderItemModel {
        const message = new OrderItemModel({});
        if (data.id != null) {
            message.id = data.id;
        }
        if (data.part_id != null) {
            message.part_id = data.part_id;
        }
        if (data.part_name != null) {
            message.part_name = data.part_name;
        }
        if (data.part_number != null) {
            message.part_number = data.part_number;
        }
        if (data.quantity != null) {
            message.quantity = data.quantity;
        }
        if (data.unit_price != null) {
            message.unit_price = data.unit_price;
        }
        if (data.total_price != null) {
            message.total_price = data.total_price;
        }
        return message;
    }
    toObject() {
        const data: {
            id?: number;
            part_id?: number;
            part_name?: string;
            part_number?: string;
            quantity?: number;
            unit_price?: number;
            total_price?: number;
        } = {};
        if (this.id != null) {
            data.id = this.id;
        }
        if (this.part_id != null) {
            data.part_id = this.part_id;
        }
        if (this.part_name != null) {
            data.part_name = this.part_name;
        }
        if (this.part_number != null) {
            data.part_number = this.part_number;
        }
        if (this.quantity != null) {
            data.quantity = this.quantity;
        }
        if (this.unit_price != null) {
            data.unit_price = this.unit_price;
        }
        if (this.total_price != null) {
            data.total_price = this.total_price;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.id != 0)
            writer.writeInt32(1, this.id);
        if (this.part_id != 0)
            writer.writeInt32(2, this.part_id);
        if (this.part_name.length)
            writer.writeString(3, this.part_name);
        if (this.part_number.length)
            writer.writeString(4, this.part_number);
        if (this.quantity != 0)
            writer.writeInt32(5, this.quantity);
        if (this.unit_price != 0)
            writer.writeDouble(6, this.unit_price);
        if (this.total_price != 0)
            writer.writeDouble(7, this.total_price);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): OrderItemModel {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new OrderItemModel();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.id = reader.readInt32();
                    break;
                case 2:
                    message.part_id = reader.readInt32();
                    break;
                case 3:
                    message.part_name = reader.readString();
                    break;
                case 4:
                    message.part_number = reader.readString();
                    break;
                case 5:
                    message.quantity = reader.readInt32();
                    break;
                case 6:
                    message.unit_price = reader.readDouble();
                    break;
                case 7:
                    message.total_price = reader.readDouble();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): OrderItemModel {
        return OrderItemModel.deserialize(bytes);
    }
}
export class OrderResponse extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        id?: number;
        customer_name?: string;
        email?: string;
        phone?: string;
        shipping_address?: string;
        status?: string;
        total_price?: number;
        created_at?: string;
        payment_method?: string;
        return_status?: string;
        return_reason?: string;
        items?: OrderItemModel[];
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [12], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("id" in data && data.id != undefined) {
                this.id = data.id;
            }
            if ("customer_name" in data && data.customer_name != undefined) {
                this.customer_name = data.customer_name;
            }
            if ("email" in data && data.email != undefined) {
                this.email = data.email;
            }
            if ("phone" in data && data.phone != undefined) {
                this.phone = data.phone;
            }
            if ("shipping_address" in data && data.shipping_address != undefined) {
                this.shipping_address = data.shipping_address;
            }
            if ("status" in data && data.status != undefined) {
                this.status = data.status;
            }
            if ("total_price" in data && data.total_price != undefined) {
                this.total_price = data.total_price;
            }
            if ("created_at" in data && data.created_at != undefined) {
                this.created_at = data.created_at;
            }
            if ("payment_method" in data && data.payment_method != undefined) {
                this.payment_method = data.payment_method;
            }
            if ("return_status" in data && data.return_status != undefined) {
                this.return_status = data.return_status;
            }
            if ("return_reason" in data && data.return_reason != undefined) {
                this.return_reason = data.return_reason;
            }
            if ("items" in data && data.items != undefined) {
                this.items = data.items;
            }
        }
    }
    get id() {
        return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
    }
    set id(value: number) {
        pb_1.Message.setField(this, 1, value);
    }
    get customer_name() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set customer_name(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get email() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set email(value: string) {
        pb_1.Message.setField(this, 3, value);
    }
    get phone() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set phone(value: string) {
        pb_1.Message.setField(this, 4, value);
    }
    get shipping_address() {
        return pb_1.Message.getFieldWithDefault(this, 5, "") as string;
    }
    set shipping_address(value: string) {
        pb_1.Message.setField(this, 5, value);
    }
    get status() {
        return pb_1.Message.getFieldWithDefault(this, 6, "") as string;
    }
    set status(value: string) {
        pb_1.Message.setField(this, 6, value);
    }
    get total_price() {
        return pb_1.Message.getFieldWithDefault(this, 7, 0) as number;
    }
    set total_price(value: number) {
        pb_1.Message.setField(this, 7, value);
    }
    get created_at() {
        return pb_1.Message.getFieldWithDefault(this, 8, "") as string;
    }
    set created_at(value: string) {
        pb_1.Message.setField(this, 8, value);
    }
    get payment_method() {
        return pb_1.Message.getFieldWithDefault(this, 9, "") as string;
    }
    set payment_method(value: string) {
        pb_1.Message.setField(this, 9, value);
    }
    get return_status() {
        return pb_1.Message.getFieldWithDefault(this, 10, "") as string;
    }
    set return_status(value: string) {
        pb_1.Message.setField(this, 10, value);
    }
    get return_reason() {
        return pb_1.Message.getFieldWithDefault(this, 11, "") as string;
    }
    set return_reason(value: string) {
        pb_1.Message.setField(this, 11, value);
    }
    get items() {
        return pb_1.Message.getRepeatedWrapperField(this, OrderItemModel, 12) as OrderItemModel[];
    }
    set items(value: OrderItemModel[]) {
        pb_1.Message.setRepeatedWrapperField(this, 12, value);
    }
    static fromObject(data: {
        id?: number;
        customer_name?: string;
        email?: string;
        phone?: string;
        shipping_address?: string;
        status?: string;
        total_price?: number;
        created_at?: string;
        payment_method?: string;
        return_status?: string;
        return_reason?: string;
        items?: ReturnType<typeof OrderItemModel.prototype.toObject>[];
    }): OrderResponse {
        const message = new OrderResponse({});
        if (data.id != null) {
            message.id = data.id;
        }
        if (data.customer_name != null) {
            message.customer_name = data.customer_name;
        }
        if (data.email != null) {
            message.email = data.email;
        }
        if (data.phone != null) {
            message.phone = data.phone;
        }
        if (data.shipping_address != null) {
            message.shipping_address = data.shipping_address;
        }
        if (data.status != null) {
            message.status = data.status;
        }
        if (data.total_price != null) {
            message.total_price = data.total_price;
        }
        if (data.created_at != null) {
            message.created_at = data.created_at;
        }
        if (data.payment_method != null) {
            message.payment_method = data.payment_method;
        }
        if (data.return_status != null) {
            message.return_status = data.return_status;
        }
        if (data.return_reason != null) {
            message.return_reason = data.return_reason;
        }
        if (data.items != null) {
            message.items = data.items.map(item => OrderItemModel.fromObject(item));
        }
        return message;
    }
    toObject() {
        const data: {
            id?: number;
            customer_name?: string;
            email?: string;
            phone?: string;
            shipping_address?: string;
            status?: string;
            total_price?: number;
            created_at?: string;
            payment_method?: string;
            return_status?: string;
            return_reason?: string;
            items?: ReturnType<typeof OrderItemModel.prototype.toObject>[];
        } = {};
        if (this.id != null) {
            data.id = this.id;
        }
        if (this.customer_name != null) {
            data.customer_name = this.customer_name;
        }
        if (this.email != null) {
            data.email = this.email;
        }
        if (this.phone != null) {
            data.phone = this.phone;
        }
        if (this.shipping_address != null) {
            data.shipping_address = this.shipping_address;
        }
        if (this.status != null) {
            data.status = this.status;
        }
        if (this.total_price != null) {
            data.total_price = this.total_price;
        }
        if (this.created_at != null) {
            data.created_at = this.created_at;
        }
        if (this.payment_method != null) {
            data.payment_method = this.payment_method;
        }
        if (this.return_status != null) {
            data.return_status = this.return_status;
        }
        if (this.return_reason != null) {
            data.return_reason = this.return_reason;
        }
        if (this.items != null) {
            data.items = this.items.map((item: OrderItemModel) => item.toObject());
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.id != 0)
            writer.writeInt32(1, this.id);
        if (this.customer_name.length)
            writer.writeString(2, this.customer_name);
        if (this.email.length)
            writer.writeString(3, this.email);
        if (this.phone.length)
            writer.writeString(4, this.phone);
        if (this.shipping_address.length)
            writer.writeString(5, this.shipping_address);
        if (this.status.length)
            writer.writeString(6, this.status);
        if (this.total_price != 0)
            writer.writeDouble(7, this.total_price);
        if (this.created_at.length)
            writer.writeString(8, this.created_at);
        if (this.payment_method.length)
            writer.writeString(9, this.payment_method);
        if (this.return_status.length)
            writer.writeString(10, this.return_status);
        if (this.return_reason.length)
            writer.writeString(11, this.return_reason);
        if (this.items.length)
            writer.writeRepeatedMessage(12, this.items, (item: OrderItemModel) => item.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): OrderResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new OrderResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.id = reader.readInt32();
                    break;
                case 2:
                    message.customer_name = reader.readString();
                    break;
                case 3:
                    message.email = reader.readString();
                    break;
                case 4:
                    message.phone = reader.readString();
                    break;
                case 5:
                    message.shipping_address = reader.readString();
                    break;
                case 6:
                    message.status = reader.readString();
                    break;
                case 7:
                    message.total_price = reader.readDouble();
                    break;
                case 8:
                    message.created_at = reader.readString();
                    break;
                case 9:
                    message.payment_method = reader.readString();
                    break;
                case 10:
                    message.return_status = reader.readString();
                    break;
                case 11:
                    message.return_reason = reader.readString();
                    break;
                case 12:
                    reader.readMessage(message.items, () => pb_1.Message.addToRepeatedWrapperField(message, 12, OrderItemModel.deserialize(reader), OrderItemModel));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): OrderResponse {
        return OrderResponse.deserialize(bytes);
    }
}
export class GetOrdersRequest extends pb_1.Message {
    #one_of_decls: number[][] = [[1], [2]];
    constructor(data?: any[] | ({} & (({
        user_id?: string;
    }) | ({
        email?: string;
    })))) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("user_id" in data && data.user_id != undefined) {
                this.user_id = data.user_id;
            }
            if ("email" in data && data.email != undefined) {
                this.email = data.email;
            }
        }
    }
    get user_id() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set user_id(value: string) {
        pb_1.Message.setOneofField(this, 1, this.#one_of_decls[0], value);
    }
    get has_user_id() {
        return pb_1.Message.getField(this, 1) != null;
    }
    get email() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set email(value: string) {
        pb_1.Message.setOneofField(this, 2, this.#one_of_decls[1], value);
    }
    get has_email() {
        return pb_1.Message.getField(this, 2) != null;
    }
    get _user_id() {
        const cases: {
            [index: number]: "none" | "user_id";
        } = {
            0: "none",
            1: "user_id"
        };
        return cases[pb_1.Message.computeOneofCase(this, [1])];
    }
    get _email() {
        const cases: {
            [index: number]: "none" | "email";
        } = {
            0: "none",
            2: "email"
        };
        return cases[pb_1.Message.computeOneofCase(this, [2])];
    }
    static fromObject(data: {
        user_id?: string;
        email?: string;
    }): GetOrdersRequest {
        const message = new GetOrdersRequest({});
        if (data.user_id != null) {
            message.user_id = data.user_id;
        }
        if (data.email != null) {
            message.email = data.email;
        }
        return message;
    }
    toObject() {
        const data: {
            user_id?: string;
            email?: string;
        } = {};
        if (this.user_id != null) {
            data.user_id = this.user_id;
        }
        if (this.email != null) {
            data.email = this.email;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.has_user_id)
            writer.writeString(1, this.user_id);
        if (this.has_email)
            writer.writeString(2, this.email);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetOrdersRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetOrdersRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.user_id = reader.readString();
                    break;
                case 2:
                    message.email = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): GetOrdersRequest {
        return GetOrdersRequest.deserialize(bytes);
    }
}
export class GetOrdersResponse extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        orders?: OrderResponse[];
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("orders" in data && data.orders != undefined) {
                this.orders = data.orders;
            }
        }
    }
    get orders() {
        return pb_1.Message.getRepeatedWrapperField(this, OrderResponse, 1) as OrderResponse[];
    }
    set orders(value: OrderResponse[]) {
        pb_1.Message.setRepeatedWrapperField(this, 1, value);
    }
    static fromObject(data: {
        orders?: ReturnType<typeof OrderResponse.prototype.toObject>[];
    }): GetOrdersResponse {
        const message = new GetOrdersResponse({});
        if (data.orders != null) {
            message.orders = data.orders.map(item => OrderResponse.fromObject(item));
        }
        return message;
    }
    toObject() {
        const data: {
            orders?: ReturnType<typeof OrderResponse.prototype.toObject>[];
        } = {};
        if (this.orders != null) {
            data.orders = this.orders.map((item: OrderResponse) => item.toObject());
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.orders.length)
            writer.writeRepeatedMessage(1, this.orders, (item: OrderResponse) => item.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetOrdersResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetOrdersResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    reader.readMessage(message.orders, () => pb_1.Message.addToRepeatedWrapperField(message, 1, OrderResponse.deserialize(reader), OrderResponse));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): GetOrdersResponse {
        return GetOrdersResponse.deserialize(bytes);
    }
}
export class GetOrderByIdRequest extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        id?: number;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("id" in data && data.id != undefined) {
                this.id = data.id;
            }
        }
    }
    get id() {
        return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
    }
    set id(value: number) {
        pb_1.Message.setField(this, 1, value);
    }
    static fromObject(data: {
        id?: number;
    }): GetOrderByIdRequest {
        const message = new GetOrderByIdRequest({});
        if (data.id != null) {
            message.id = data.id;
        }
        return message;
    }
    toObject() {
        const data: {
            id?: number;
        } = {};
        if (this.id != null) {
            data.id = this.id;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.id != 0)
            writer.writeInt32(1, this.id);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetOrderByIdRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetOrderByIdRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.id = reader.readInt32();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): GetOrderByIdRequest {
        return GetOrderByIdRequest.deserialize(bytes);
    }
}
export class RequestReturnRequest extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        order_id?: number;
        reason?: string;
        comments?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("order_id" in data && data.order_id != undefined) {
                this.order_id = data.order_id;
            }
            if ("reason" in data && data.reason != undefined) {
                this.reason = data.reason;
            }
            if ("comments" in data && data.comments != undefined) {
                this.comments = data.comments;
            }
        }
    }
    get order_id() {
        return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
    }
    set order_id(value: number) {
        pb_1.Message.setField(this, 1, value);
    }
    get reason() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set reason(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get comments() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set comments(value: string) {
        pb_1.Message.setField(this, 3, value);
    }
    static fromObject(data: {
        order_id?: number;
        reason?: string;
        comments?: string;
    }): RequestReturnRequest {
        const message = new RequestReturnRequest({});
        if (data.order_id != null) {
            message.order_id = data.order_id;
        }
        if (data.reason != null) {
            message.reason = data.reason;
        }
        if (data.comments != null) {
            message.comments = data.comments;
        }
        return message;
    }
    toObject() {
        const data: {
            order_id?: number;
            reason?: string;
            comments?: string;
        } = {};
        if (this.order_id != null) {
            data.order_id = this.order_id;
        }
        if (this.reason != null) {
            data.reason = this.reason;
        }
        if (this.comments != null) {
            data.comments = this.comments;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.order_id != 0)
            writer.writeInt32(1, this.order_id);
        if (this.reason.length)
            writer.writeString(2, this.reason);
        if (this.comments.length)
            writer.writeString(3, this.comments);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): RequestReturnRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new RequestReturnRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.order_id = reader.readInt32();
                    break;
                case 2:
                    message.reason = reader.readString();
                    break;
                case 3:
                    message.comments = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): RequestReturnRequest {
        return RequestReturnRequest.deserialize(bytes);
    }
}
export class RequestReturnResponse extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        success?: boolean;
        message?: string;
        order_id?: number;
        new_status?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("success" in data && data.success != undefined) {
                this.success = data.success;
            }
            if ("message" in data && data.message != undefined) {
                this.message = data.message;
            }
            if ("order_id" in data && data.order_id != undefined) {
                this.order_id = data.order_id;
            }
            if ("new_status" in data && data.new_status != undefined) {
                this.new_status = data.new_status;
            }
        }
    }
    get success() {
        return pb_1.Message.getFieldWithDefault(this, 1, false) as boolean;
    }
    set success(value: boolean) {
        pb_1.Message.setField(this, 1, value);
    }
    get message() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set message(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get order_id() {
        return pb_1.Message.getFieldWithDefault(this, 3, 0) as number;
    }
    set order_id(value: number) {
        pb_1.Message.setField(this, 3, value);
    }
    get new_status() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set new_status(value: string) {
        pb_1.Message.setField(this, 4, value);
    }
    static fromObject(data: {
        success?: boolean;
        message?: string;
        order_id?: number;
        new_status?: string;
    }): RequestReturnResponse {
        const message = new RequestReturnResponse({});
        if (data.success != null) {
            message.success = data.success;
        }
        if (data.message != null) {
            message.message = data.message;
        }
        if (data.order_id != null) {
            message.order_id = data.order_id;
        }
        if (data.new_status != null) {
            message.new_status = data.new_status;
        }
        return message;
    }
    toObject() {
        const data: {
            success?: boolean;
            message?: string;
            order_id?: number;
            new_status?: string;
        } = {};
        if (this.success != null) {
            data.success = this.success;
        }
        if (this.message != null) {
            data.message = this.message;
        }
        if (this.order_id != null) {
            data.order_id = this.order_id;
        }
        if (this.new_status != null) {
            data.new_status = this.new_status;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.success != false)
            writer.writeBool(1, this.success);
        if (this.message.length)
            writer.writeString(2, this.message);
        if (this.order_id != 0)
            writer.writeInt32(3, this.order_id);
        if (this.new_status.length)
            writer.writeString(4, this.new_status);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): RequestReturnResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new RequestReturnResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.success = reader.readBool();
                    break;
                case 2:
                    message.message = reader.readString();
                    break;
                case 3:
                    message.order_id = reader.readInt32();
                    break;
                case 4:
                    message.new_status = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): RequestReturnResponse {
        return RequestReturnResponse.deserialize(bytes);
    }
}
export abstract class UnimplementedOrderServiceService {
    static definition = {
        CreateOrder: {
            path: "/carpartshop.orders.OrderService/CreateOrder",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: CreateOrderRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => CreateOrderRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: OrderResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => OrderResponse.deserialize(new Uint8Array(bytes))
        },
        GetOrders: {
            path: "/carpartshop.orders.OrderService/GetOrders",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: GetOrdersRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetOrdersRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: GetOrdersResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => GetOrdersResponse.deserialize(new Uint8Array(bytes))
        },
        GetOrderById: {
            path: "/carpartshop.orders.OrderService/GetOrderById",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: GetOrderByIdRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetOrderByIdRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: OrderResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => OrderResponse.deserialize(new Uint8Array(bytes))
        },
        RequestReturn: {
            path: "/carpartshop.orders.OrderService/RequestReturn",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: RequestReturnRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => RequestReturnRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: RequestReturnResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => RequestReturnResponse.deserialize(new Uint8Array(bytes))
        }
    };
    [method: string]: grpc_1.UntypedHandleCall;
    abstract CreateOrder(call: grpc_1.ServerUnaryCall<CreateOrderRequest, OrderResponse>, callback: grpc_1.sendUnaryData<OrderResponse>): void;
    abstract GetOrders(call: grpc_1.ServerUnaryCall<GetOrdersRequest, GetOrdersResponse>, callback: grpc_1.sendUnaryData<GetOrdersResponse>): void;
    abstract GetOrderById(call: grpc_1.ServerUnaryCall<GetOrderByIdRequest, OrderResponse>, callback: grpc_1.sendUnaryData<OrderResponse>): void;
    abstract RequestReturn(call: grpc_1.ServerUnaryCall<RequestReturnRequest, RequestReturnResponse>, callback: grpc_1.sendUnaryData<RequestReturnResponse>): void;
}
export class OrderServiceClient {
    private _address: string;
    private _client: grpc_web_1.GrpcWebClientBase;
    constructor(address: string, credentials?: Object, options?: grpc_web_1.GrpcWebClientBaseOptions) {
        if (!options)
            options = {};
        options.format = options.format || "text";
        this._address = address;
        this._client = new grpc_web_1.GrpcWebClientBase(options);
    }
    private static CreateOrder = new grpc_web_1.MethodDescriptor<CreateOrderRequest, OrderResponse>("/carpartshop.orders.OrderService/CreateOrder", grpc_web_1.MethodType.UNARY, CreateOrderRequest, OrderResponse, (message: CreateOrderRequest) => message.serialize(), OrderResponse.deserialize);
    CreateOrder(message: CreateOrderRequest, metadata: grpc_web_1.Metadata | null) {
        return this._client.thenableCall<CreateOrderRequest, OrderResponse>(this._address + "/carpartshop.orders.OrderService/CreateOrder", message, metadata || {}, OrderServiceClient.CreateOrder);
    }
    private static GetOrders = new grpc_web_1.MethodDescriptor<GetOrdersRequest, GetOrdersResponse>("/carpartshop.orders.OrderService/GetOrders", grpc_web_1.MethodType.UNARY, GetOrdersRequest, GetOrdersResponse, (message: GetOrdersRequest) => message.serialize(), GetOrdersResponse.deserialize);
    GetOrders(message: GetOrdersRequest, metadata: grpc_web_1.Metadata | null) {
        return this._client.thenableCall<GetOrdersRequest, GetOrdersResponse>(this._address + "/carpartshop.orders.OrderService/GetOrders", message, metadata || {}, OrderServiceClient.GetOrders);
    }
    private static GetOrderById = new grpc_web_1.MethodDescriptor<GetOrderByIdRequest, OrderResponse>("/carpartshop.orders.OrderService/GetOrderById", grpc_web_1.MethodType.UNARY, GetOrderByIdRequest, OrderResponse, (message: GetOrderByIdRequest) => message.serialize(), OrderResponse.deserialize);
    GetOrderById(message: GetOrderByIdRequest, metadata: grpc_web_1.Metadata | null) {
        return this._client.thenableCall<GetOrderByIdRequest, OrderResponse>(this._address + "/carpartshop.orders.OrderService/GetOrderById", message, metadata || {}, OrderServiceClient.GetOrderById);
    }
    private static RequestReturn = new grpc_web_1.MethodDescriptor<RequestReturnRequest, RequestReturnResponse>("/carpartshop.orders.OrderService/RequestReturn", grpc_web_1.MethodType.UNARY, RequestReturnRequest, RequestReturnResponse, (message: RequestReturnRequest) => message.serialize(), RequestReturnResponse.deserialize);
    RequestReturn(message: RequestReturnRequest, metadata: grpc_web_1.Metadata | null) {
        return this._client.thenableCall<RequestReturnRequest, RequestReturnResponse>(this._address + "/carpartshop.orders.OrderService/RequestReturn", message, metadata || {}, OrderServiceClient.RequestReturn);
    }
}
