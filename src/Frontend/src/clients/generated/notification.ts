
import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@grpc/grpc-js";
import * as grpc_web_1 from "grpc-web";
export class NotificationModel extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        id?: number;
        title?: string;
        message?: string;
        type?: string;
        is_read?: boolean;
        created_at?: string;
        link?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("id" in data && data.id != undefined) {
                this.id = data.id;
            }
            if ("title" in data && data.title != undefined) {
                this.title = data.title;
            }
            if ("message" in data && data.message != undefined) {
                this.message = data.message;
            }
            if ("type" in data && data.type != undefined) {
                this.type = data.type;
            }
            if ("is_read" in data && data.is_read != undefined) {
                this.is_read = data.is_read;
            }
            if ("created_at" in data && data.created_at != undefined) {
                this.created_at = data.created_at;
            }
            if ("link" in data && data.link != undefined) {
                this.link = data.link;
            }
        }
    }
    get id() {
        return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
    }
    set id(value: number) {
        pb_1.Message.setField(this, 1, value);
    }
    get title() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set title(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get message() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set message(value: string) {
        pb_1.Message.setField(this, 3, value);
    }
    get type() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set type(value: string) {
        pb_1.Message.setField(this, 4, value);
    }
    get is_read() {
        return pb_1.Message.getFieldWithDefault(this, 5, false) as boolean;
    }
    set is_read(value: boolean) {
        pb_1.Message.setField(this, 5, value);
    }
    get created_at() {
        return pb_1.Message.getFieldWithDefault(this, 6, "") as string;
    }
    set created_at(value: string) {
        pb_1.Message.setField(this, 6, value);
    }
    get link() {
        return pb_1.Message.getFieldWithDefault(this, 7, "") as string;
    }
    set link(value: string) {
        pb_1.Message.setField(this, 7, value);
    }
    static fromObject(data: {
        id?: number;
        title?: string;
        message?: string;
        type?: string;
        is_read?: boolean;
        created_at?: string;
        link?: string;
    }): NotificationModel {
        const message = new NotificationModel({});
        if (data.id != null) {
            message.id = data.id;
        }
        if (data.title != null) {
            message.title = data.title;
        }
        if (data.message != null) {
            message.message = data.message;
        }
        if (data.type != null) {
            message.type = data.type;
        }
        if (data.is_read != null) {
            message.is_read = data.is_read;
        }
        if (data.created_at != null) {
            message.created_at = data.created_at;
        }
        if (data.link != null) {
            message.link = data.link;
        }
        return message;
    }
    toObject() {
        const data: {
            id?: number;
            title?: string;
            message?: string;
            type?: string;
            is_read?: boolean;
            created_at?: string;
            link?: string;
        } = {};
        if (this.id != null) {
            data.id = this.id;
        }
        if (this.title != null) {
            data.title = this.title;
        }
        if (this.message != null) {
            data.message = this.message;
        }
        if (this.type != null) {
            data.type = this.type;
        }
        if (this.is_read != null) {
            data.is_read = this.is_read;
        }
        if (this.created_at != null) {
            data.created_at = this.created_at;
        }
        if (this.link != null) {
            data.link = this.link;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.id != 0)
            writer.writeInt32(1, this.id);
        if (this.title.length)
            writer.writeString(2, this.title);
        if (this.message.length)
            writer.writeString(3, this.message);
        if (this.type.length)
            writer.writeString(4, this.type);
        if (this.is_read != false)
            writer.writeBool(5, this.is_read);
        if (this.created_at.length)
            writer.writeString(6, this.created_at);
        if (this.link.length)
            writer.writeString(7, this.link);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): NotificationModel {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new NotificationModel();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.id = reader.readInt32();
                    break;
                case 2:
                    message.title = reader.readString();
                    break;
                case 3:
                    message.message = reader.readString();
                    break;
                case 4:
                    message.type = reader.readString();
                    break;
                case 5:
                    message.is_read = reader.readBool();
                    break;
                case 6:
                    message.created_at = reader.readString();
                    break;
                case 7:
                    message.link = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): NotificationModel {
        return NotificationModel.deserialize(bytes);
    }
}
export class GetNotificationsRequest extends pb_1.Message {
    #one_of_decls: number[][] = [[1]];
    constructor(data?: any[] | ({} & (({
        unread_only?: boolean;
    })))) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("unread_only" in data && data.unread_only != undefined) {
                this.unread_only = data.unread_only;
            }
        }
    }
    get unread_only() {
        return pb_1.Message.getFieldWithDefault(this, 1, false) as boolean;
    }
    set unread_only(value: boolean) {
        pb_1.Message.setOneofField(this, 1, this.#one_of_decls[0], value);
    }
    get has_unread_only() {
        return pb_1.Message.getField(this, 1) != null;
    }
    get _unread_only() {
        const cases: {
            [index: number]: "none" | "unread_only";
        } = {
            0: "none",
            1: "unread_only"
        };
        return cases[pb_1.Message.computeOneofCase(this, [1])];
    }
    static fromObject(data: {
        unread_only?: boolean;
    }): GetNotificationsRequest {
        const message = new GetNotificationsRequest({});
        if (data.unread_only != null) {
            message.unread_only = data.unread_only;
        }
        return message;
    }
    toObject() {
        const data: {
            unread_only?: boolean;
        } = {};
        if (this.unread_only != null) {
            data.unread_only = this.unread_only;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.has_unread_only)
            writer.writeBool(1, this.unread_only);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetNotificationsRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetNotificationsRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.unread_only = reader.readBool();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): GetNotificationsRequest {
        return GetNotificationsRequest.deserialize(bytes);
    }
}
export class GetNotificationsResponse extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        notifications?: NotificationModel[];
        unread_count?: number;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("notifications" in data && data.notifications != undefined) {
                this.notifications = data.notifications;
            }
            if ("unread_count" in data && data.unread_count != undefined) {
                this.unread_count = data.unread_count;
            }
        }
    }
    get notifications() {
        return pb_1.Message.getRepeatedWrapperField(this, NotificationModel, 1) as NotificationModel[];
    }
    set notifications(value: NotificationModel[]) {
        pb_1.Message.setRepeatedWrapperField(this, 1, value);
    }
    get unread_count() {
        return pb_1.Message.getFieldWithDefault(this, 2, 0) as number;
    }
    set unread_count(value: number) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        notifications?: ReturnType<typeof NotificationModel.prototype.toObject>[];
        unread_count?: number;
    }): GetNotificationsResponse {
        const message = new GetNotificationsResponse({});
        if (data.notifications != null) {
            message.notifications = data.notifications.map(item => NotificationModel.fromObject(item));
        }
        if (data.unread_count != null) {
            message.unread_count = data.unread_count;
        }
        return message;
    }
    toObject() {
        const data: {
            notifications?: ReturnType<typeof NotificationModel.prototype.toObject>[];
            unread_count?: number;
        } = {};
        if (this.notifications != null) {
            data.notifications = this.notifications.map((item: NotificationModel) => item.toObject());
        }
        if (this.unread_count != null) {
            data.unread_count = this.unread_count;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.notifications.length)
            writer.writeRepeatedMessage(1, this.notifications, (item: NotificationModel) => item.serialize(writer));
        if (this.unread_count != 0)
            writer.writeInt32(2, this.unread_count);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetNotificationsResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetNotificationsResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    reader.readMessage(message.notifications, () => pb_1.Message.addToRepeatedWrapperField(message, 1, NotificationModel.deserialize(reader), NotificationModel));
                    break;
                case 2:
                    message.unread_count = reader.readInt32();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): GetNotificationsResponse {
        return GetNotificationsResponse.deserialize(bytes);
    }
}
export class MarkAsReadRequest extends pb_1.Message {
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
    }): MarkAsReadRequest {
        const message = new MarkAsReadRequest({});
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
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): MarkAsReadRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new MarkAsReadRequest();
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
    static deserializeBinary(bytes: Uint8Array): MarkAsReadRequest {
        return MarkAsReadRequest.deserialize(bytes);
    }
}
export class MarkAsReadResponse extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        success?: boolean;
        message?: string;
        unread_count?: number;
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
            if ("unread_count" in data && data.unread_count != undefined) {
                this.unread_count = data.unread_count;
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
    get unread_count() {
        return pb_1.Message.getFieldWithDefault(this, 3, 0) as number;
    }
    set unread_count(value: number) {
        pb_1.Message.setField(this, 3, value);
    }
    static fromObject(data: {
        success?: boolean;
        message?: string;
        unread_count?: number;
    }): MarkAsReadResponse {
        const message = new MarkAsReadResponse({});
        if (data.success != null) {
            message.success = data.success;
        }
        if (data.message != null) {
            message.message = data.message;
        }
        if (data.unread_count != null) {
            message.unread_count = data.unread_count;
        }
        return message;
    }
    toObject() {
        const data: {
            success?: boolean;
            message?: string;
            unread_count?: number;
        } = {};
        if (this.success != null) {
            data.success = this.success;
        }
        if (this.message != null) {
            data.message = this.message;
        }
        if (this.unread_count != null) {
            data.unread_count = this.unread_count;
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
        if (this.unread_count != 0)
            writer.writeInt32(3, this.unread_count);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): MarkAsReadResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new MarkAsReadResponse();
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
                    message.unread_count = reader.readInt32();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): MarkAsReadResponse {
        return MarkAsReadResponse.deserialize(bytes);
    }
}
export class MarkAllAsReadRequest extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {}) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") { }
    }
    static fromObject(data: {}): MarkAllAsReadRequest {
        const message = new MarkAllAsReadRequest({});
        return message;
    }
    toObject() {
        const data: {} = {};
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): MarkAllAsReadRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new MarkAllAsReadRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): MarkAllAsReadRequest {
        return MarkAllAsReadRequest.deserialize(bytes);
    }
}
export class MarkAllAsReadResponse extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        success?: boolean;
        updated_count?: number;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("success" in data && data.success != undefined) {
                this.success = data.success;
            }
            if ("updated_count" in data && data.updated_count != undefined) {
                this.updated_count = data.updated_count;
            }
        }
    }
    get success() {
        return pb_1.Message.getFieldWithDefault(this, 1, false) as boolean;
    }
    set success(value: boolean) {
        pb_1.Message.setField(this, 1, value);
    }
    get updated_count() {
        return pb_1.Message.getFieldWithDefault(this, 2, 0) as number;
    }
    set updated_count(value: number) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        success?: boolean;
        updated_count?: number;
    }): MarkAllAsReadResponse {
        const message = new MarkAllAsReadResponse({});
        if (data.success != null) {
            message.success = data.success;
        }
        if (data.updated_count != null) {
            message.updated_count = data.updated_count;
        }
        return message;
    }
    toObject() {
        const data: {
            success?: boolean;
            updated_count?: number;
        } = {};
        if (this.success != null) {
            data.success = this.success;
        }
        if (this.updated_count != null) {
            data.updated_count = this.updated_count;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.success != false)
            writer.writeBool(1, this.success);
        if (this.updated_count != 0)
            writer.writeInt32(2, this.updated_count);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): MarkAllAsReadResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new MarkAllAsReadResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.success = reader.readBool();
                    break;
                case 2:
                    message.updated_count = reader.readInt32();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): MarkAllAsReadResponse {
        return MarkAllAsReadResponse.deserialize(bytes);
    }
}
export abstract class UnimplementedNotificationServiceService {
    static definition = {
        GetNotifications: {
            path: "/carpartshop.notification.NotificationService/GetNotifications",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: GetNotificationsRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetNotificationsRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: GetNotificationsResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => GetNotificationsResponse.deserialize(new Uint8Array(bytes))
        },
        MarkAsRead: {
            path: "/carpartshop.notification.NotificationService/MarkAsRead",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: MarkAsReadRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => MarkAsReadRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: MarkAsReadResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => MarkAsReadResponse.deserialize(new Uint8Array(bytes))
        },
        MarkAllAsRead: {
            path: "/carpartshop.notification.NotificationService/MarkAllAsRead",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: MarkAllAsReadRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => MarkAllAsReadRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: MarkAllAsReadResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => MarkAllAsReadResponse.deserialize(new Uint8Array(bytes))
        }
    };
    [method: string]: grpc_1.UntypedHandleCall;
    abstract GetNotifications(call: grpc_1.ServerUnaryCall<GetNotificationsRequest, GetNotificationsResponse>, callback: grpc_1.sendUnaryData<GetNotificationsResponse>): void;
    abstract MarkAsRead(call: grpc_1.ServerUnaryCall<MarkAsReadRequest, MarkAsReadResponse>, callback: grpc_1.sendUnaryData<MarkAsReadResponse>): void;
    abstract MarkAllAsRead(call: grpc_1.ServerUnaryCall<MarkAllAsReadRequest, MarkAllAsReadResponse>, callback: grpc_1.sendUnaryData<MarkAllAsReadResponse>): void;
}
export class NotificationServiceClient {
    private _address: string;
    private _client: grpc_web_1.GrpcWebClientBase;
    constructor(address: string, credentials?: Object, options?: grpc_web_1.GrpcWebClientBaseOptions) {
        if (!options)
            options = {};
        options.format = options.format || "text";
        this._address = address;
        this._client = new grpc_web_1.GrpcWebClientBase(options);
    }
    private static GetNotifications = new grpc_web_1.MethodDescriptor<GetNotificationsRequest, GetNotificationsResponse>("/carpartshop.notification.NotificationService/GetNotifications", grpc_web_1.MethodType.UNARY, GetNotificationsRequest, GetNotificationsResponse, (message: GetNotificationsRequest) => message.serialize(), GetNotificationsResponse.deserialize);
    GetNotifications(message: GetNotificationsRequest, metadata: grpc_web_1.Metadata | null) {
        return this._client.thenableCall<GetNotificationsRequest, GetNotificationsResponse>(this._address + "/carpartshop.notification.NotificationService/GetNotifications", message, metadata || {}, NotificationServiceClient.GetNotifications);
    }
    private static MarkAsRead = new grpc_web_1.MethodDescriptor<MarkAsReadRequest, MarkAsReadResponse>("/carpartshop.notification.NotificationService/MarkAsRead", grpc_web_1.MethodType.UNARY, MarkAsReadRequest, MarkAsReadResponse, (message: MarkAsReadRequest) => message.serialize(), MarkAsReadResponse.deserialize);
    MarkAsRead(message: MarkAsReadRequest, metadata: grpc_web_1.Metadata | null) {
        return this._client.thenableCall<MarkAsReadRequest, MarkAsReadResponse>(this._address + "/carpartshop.notification.NotificationService/MarkAsRead", message, metadata || {}, NotificationServiceClient.MarkAsRead);
    }
    private static MarkAllAsRead = new grpc_web_1.MethodDescriptor<MarkAllAsReadRequest, MarkAllAsReadResponse>("/carpartshop.notification.NotificationService/MarkAllAsRead", grpc_web_1.MethodType.UNARY, MarkAllAsReadRequest, MarkAllAsReadResponse, (message: MarkAllAsReadRequest) => message.serialize(), MarkAllAsReadResponse.deserialize);
    MarkAllAsRead(message: MarkAllAsReadRequest, metadata: grpc_web_1.Metadata | null) {
        return this._client.thenableCall<MarkAllAsReadRequest, MarkAllAsReadResponse>(this._address + "/carpartshop.notification.NotificationService/MarkAllAsRead", message, metadata || {}, NotificationServiceClient.MarkAllAsRead);
    }
}
