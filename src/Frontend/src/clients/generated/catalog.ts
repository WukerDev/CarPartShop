
import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@grpc/grpc-js";
import * as grpc_web_1 from "grpc-web";
export class GetCategoriesRequest extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {}) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") { }
    }
    static fromObject(data: {}): GetCategoriesRequest {
        const message = new GetCategoriesRequest({});
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
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetCategoriesRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetCategoriesRequest();
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
    static deserializeBinary(bytes: Uint8Array): GetCategoriesRequest {
        return GetCategoriesRequest.deserialize(bytes);
    }
}
export class CategoryModel extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        id?: number;
        name?: string;
        slug?: string;
        description?: string;
        icon?: string;
        parts_count?: number;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("id" in data && data.id != undefined) {
                this.id = data.id;
            }
            if ("name" in data && data.name != undefined) {
                this.name = data.name;
            }
            if ("slug" in data && data.slug != undefined) {
                this.slug = data.slug;
            }
            if ("description" in data && data.description != undefined) {
                this.description = data.description;
            }
            if ("icon" in data && data.icon != undefined) {
                this.icon = data.icon;
            }
            if ("parts_count" in data && data.parts_count != undefined) {
                this.parts_count = data.parts_count;
            }
        }
    }
    get id() {
        return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
    }
    set id(value: number) {
        pb_1.Message.setField(this, 1, value);
    }
    get name() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set name(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get slug() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set slug(value: string) {
        pb_1.Message.setField(this, 3, value);
    }
    get description() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set description(value: string) {
        pb_1.Message.setField(this, 4, value);
    }
    get icon() {
        return pb_1.Message.getFieldWithDefault(this, 5, "") as string;
    }
    set icon(value: string) {
        pb_1.Message.setField(this, 5, value);
    }
    get parts_count() {
        return pb_1.Message.getFieldWithDefault(this, 6, 0) as number;
    }
    set parts_count(value: number) {
        pb_1.Message.setField(this, 6, value);
    }
    static fromObject(data: {
        id?: number;
        name?: string;
        slug?: string;
        description?: string;
        icon?: string;
        parts_count?: number;
    }): CategoryModel {
        const message = new CategoryModel({});
        if (data.id != null) {
            message.id = data.id;
        }
        if (data.name != null) {
            message.name = data.name;
        }
        if (data.slug != null) {
            message.slug = data.slug;
        }
        if (data.description != null) {
            message.description = data.description;
        }
        if (data.icon != null) {
            message.icon = data.icon;
        }
        if (data.parts_count != null) {
            message.parts_count = data.parts_count;
        }
        return message;
    }
    toObject() {
        const data: {
            id?: number;
            name?: string;
            slug?: string;
            description?: string;
            icon?: string;
            parts_count?: number;
        } = {};
        if (this.id != null) {
            data.id = this.id;
        }
        if (this.name != null) {
            data.name = this.name;
        }
        if (this.slug != null) {
            data.slug = this.slug;
        }
        if (this.description != null) {
            data.description = this.description;
        }
        if (this.icon != null) {
            data.icon = this.icon;
        }
        if (this.parts_count != null) {
            data.parts_count = this.parts_count;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.id != 0)
            writer.writeInt32(1, this.id);
        if (this.name.length)
            writer.writeString(2, this.name);
        if (this.slug.length)
            writer.writeString(3, this.slug);
        if (this.description.length)
            writer.writeString(4, this.description);
        if (this.icon.length)
            writer.writeString(5, this.icon);
        if (this.parts_count != 0)
            writer.writeInt32(6, this.parts_count);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): CategoryModel {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new CategoryModel();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.id = reader.readInt32();
                    break;
                case 2:
                    message.name = reader.readString();
                    break;
                case 3:
                    message.slug = reader.readString();
                    break;
                case 4:
                    message.description = reader.readString();
                    break;
                case 5:
                    message.icon = reader.readString();
                    break;
                case 6:
                    message.parts_count = reader.readInt32();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): CategoryModel {
        return CategoryModel.deserialize(bytes);
    }
}
export class GetCategoriesResponse extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        categories?: CategoryModel[];
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("categories" in data && data.categories != undefined) {
                this.categories = data.categories;
            }
        }
    }
    get categories() {
        return pb_1.Message.getRepeatedWrapperField(this, CategoryModel, 1) as CategoryModel[];
    }
    set categories(value: CategoryModel[]) {
        pb_1.Message.setRepeatedWrapperField(this, 1, value);
    }
    static fromObject(data: {
        categories?: ReturnType<typeof CategoryModel.prototype.toObject>[];
    }): GetCategoriesResponse {
        const message = new GetCategoriesResponse({});
        if (data.categories != null) {
            message.categories = data.categories.map(item => CategoryModel.fromObject(item));
        }
        return message;
    }
    toObject() {
        const data: {
            categories?: ReturnType<typeof CategoryModel.prototype.toObject>[];
        } = {};
        if (this.categories != null) {
            data.categories = this.categories.map((item: CategoryModel) => item.toObject());
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.categories.length)
            writer.writeRepeatedMessage(1, this.categories, (item: CategoryModel) => item.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetCategoriesResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetCategoriesResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    reader.readMessage(message.categories, () => pb_1.Message.addToRepeatedWrapperField(message, 1, CategoryModel.deserialize(reader), CategoryModel));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): GetCategoriesResponse {
        return GetCategoriesResponse.deserialize(bytes);
    }
}
export class CarPartModel extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        id?: number;
        name?: string;
        part_number?: string;
        category_id?: number;
        category_name?: string;
        manufacturer?: string;
        price?: number;
        stock_quantity?: number;
        description?: string;
        compatibility?: string;
        image_url?: string;
        rating?: number;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("id" in data && data.id != undefined) {
                this.id = data.id;
            }
            if ("name" in data && data.name != undefined) {
                this.name = data.name;
            }
            if ("part_number" in data && data.part_number != undefined) {
                this.part_number = data.part_number;
            }
            if ("category_id" in data && data.category_id != undefined) {
                this.category_id = data.category_id;
            }
            if ("category_name" in data && data.category_name != undefined) {
                this.category_name = data.category_name;
            }
            if ("manufacturer" in data && data.manufacturer != undefined) {
                this.manufacturer = data.manufacturer;
            }
            if ("price" in data && data.price != undefined) {
                this.price = data.price;
            }
            if ("stock_quantity" in data && data.stock_quantity != undefined) {
                this.stock_quantity = data.stock_quantity;
            }
            if ("description" in data && data.description != undefined) {
                this.description = data.description;
            }
            if ("compatibility" in data && data.compatibility != undefined) {
                this.compatibility = data.compatibility;
            }
            if ("image_url" in data && data.image_url != undefined) {
                this.image_url = data.image_url;
            }
            if ("rating" in data && data.rating != undefined) {
                this.rating = data.rating;
            }
        }
    }
    get id() {
        return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
    }
    set id(value: number) {
        pb_1.Message.setField(this, 1, value);
    }
    get name() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set name(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get part_number() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set part_number(value: string) {
        pb_1.Message.setField(this, 3, value);
    }
    get category_id() {
        return pb_1.Message.getFieldWithDefault(this, 4, 0) as number;
    }
    set category_id(value: number) {
        pb_1.Message.setField(this, 4, value);
    }
    get category_name() {
        return pb_1.Message.getFieldWithDefault(this, 5, "") as string;
    }
    set category_name(value: string) {
        pb_1.Message.setField(this, 5, value);
    }
    get manufacturer() {
        return pb_1.Message.getFieldWithDefault(this, 6, "") as string;
    }
    set manufacturer(value: string) {
        pb_1.Message.setField(this, 6, value);
    }
    get price() {
        return pb_1.Message.getFieldWithDefault(this, 7, 0) as number;
    }
    set price(value: number) {
        pb_1.Message.setField(this, 7, value);
    }
    get stock_quantity() {
        return pb_1.Message.getFieldWithDefault(this, 8, 0) as number;
    }
    set stock_quantity(value: number) {
        pb_1.Message.setField(this, 8, value);
    }
    get description() {
        return pb_1.Message.getFieldWithDefault(this, 9, "") as string;
    }
    set description(value: string) {
        pb_1.Message.setField(this, 9, value);
    }
    get compatibility() {
        return pb_1.Message.getFieldWithDefault(this, 10, "") as string;
    }
    set compatibility(value: string) {
        pb_1.Message.setField(this, 10, value);
    }
    get image_url() {
        return pb_1.Message.getFieldWithDefault(this, 11, "") as string;
    }
    set image_url(value: string) {
        pb_1.Message.setField(this, 11, value);
    }
    get rating() {
        return pb_1.Message.getFieldWithDefault(this, 12, 0) as number;
    }
    set rating(value: number) {
        pb_1.Message.setField(this, 12, value);
    }
    static fromObject(data: {
        id?: number;
        name?: string;
        part_number?: string;
        category_id?: number;
        category_name?: string;
        manufacturer?: string;
        price?: number;
        stock_quantity?: number;
        description?: string;
        compatibility?: string;
        image_url?: string;
        rating?: number;
    }): CarPartModel {
        const message = new CarPartModel({});
        if (data.id != null) {
            message.id = data.id;
        }
        if (data.name != null) {
            message.name = data.name;
        }
        if (data.part_number != null) {
            message.part_number = data.part_number;
        }
        if (data.category_id != null) {
            message.category_id = data.category_id;
        }
        if (data.category_name != null) {
            message.category_name = data.category_name;
        }
        if (data.manufacturer != null) {
            message.manufacturer = data.manufacturer;
        }
        if (data.price != null) {
            message.price = data.price;
        }
        if (data.stock_quantity != null) {
            message.stock_quantity = data.stock_quantity;
        }
        if (data.description != null) {
            message.description = data.description;
        }
        if (data.compatibility != null) {
            message.compatibility = data.compatibility;
        }
        if (data.image_url != null) {
            message.image_url = data.image_url;
        }
        if (data.rating != null) {
            message.rating = data.rating;
        }
        return message;
    }
    toObject() {
        const data: {
            id?: number;
            name?: string;
            part_number?: string;
            category_id?: number;
            category_name?: string;
            manufacturer?: string;
            price?: number;
            stock_quantity?: number;
            description?: string;
            compatibility?: string;
            image_url?: string;
            rating?: number;
        } = {};
        if (this.id != null) {
            data.id = this.id;
        }
        if (this.name != null) {
            data.name = this.name;
        }
        if (this.part_number != null) {
            data.part_number = this.part_number;
        }
        if (this.category_id != null) {
            data.category_id = this.category_id;
        }
        if (this.category_name != null) {
            data.category_name = this.category_name;
        }
        if (this.manufacturer != null) {
            data.manufacturer = this.manufacturer;
        }
        if (this.price != null) {
            data.price = this.price;
        }
        if (this.stock_quantity != null) {
            data.stock_quantity = this.stock_quantity;
        }
        if (this.description != null) {
            data.description = this.description;
        }
        if (this.compatibility != null) {
            data.compatibility = this.compatibility;
        }
        if (this.image_url != null) {
            data.image_url = this.image_url;
        }
        if (this.rating != null) {
            data.rating = this.rating;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.id != 0)
            writer.writeInt32(1, this.id);
        if (this.name.length)
            writer.writeString(2, this.name);
        if (this.part_number.length)
            writer.writeString(3, this.part_number);
        if (this.category_id != 0)
            writer.writeInt32(4, this.category_id);
        if (this.category_name.length)
            writer.writeString(5, this.category_name);
        if (this.manufacturer.length)
            writer.writeString(6, this.manufacturer);
        if (this.price != 0)
            writer.writeDouble(7, this.price);
        if (this.stock_quantity != 0)
            writer.writeInt32(8, this.stock_quantity);
        if (this.description.length)
            writer.writeString(9, this.description);
        if (this.compatibility.length)
            writer.writeString(10, this.compatibility);
        if (this.image_url.length)
            writer.writeString(11, this.image_url);
        if (this.rating != 0)
            writer.writeDouble(12, this.rating);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): CarPartModel {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new CarPartModel();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.id = reader.readInt32();
                    break;
                case 2:
                    message.name = reader.readString();
                    break;
                case 3:
                    message.part_number = reader.readString();
                    break;
                case 4:
                    message.category_id = reader.readInt32();
                    break;
                case 5:
                    message.category_name = reader.readString();
                    break;
                case 6:
                    message.manufacturer = reader.readString();
                    break;
                case 7:
                    message.price = reader.readDouble();
                    break;
                case 8:
                    message.stock_quantity = reader.readInt32();
                    break;
                case 9:
                    message.description = reader.readString();
                    break;
                case 10:
                    message.compatibility = reader.readString();
                    break;
                case 11:
                    message.image_url = reader.readString();
                    break;
                case 12:
                    message.rating = reader.readDouble();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): CarPartModel {
        return CarPartModel.deserialize(bytes);
    }
}
export class GetPartsRequest extends pb_1.Message {
    #one_of_decls: number[][] = [[1], [2], [3], [4], [5]];
    constructor(data?: any[] | ({} & (({
        category_id?: number;
    }) | ({
        search?: string;
    }) | ({
        min_price?: number;
    }) | ({
        max_price?: number;
    }) | ({
        in_stock_only?: boolean;
    })))) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("category_id" in data && data.category_id != undefined) {
                this.category_id = data.category_id;
            }
            if ("search" in data && data.search != undefined) {
                this.search = data.search;
            }
            if ("min_price" in data && data.min_price != undefined) {
                this.min_price = data.min_price;
            }
            if ("max_price" in data && data.max_price != undefined) {
                this.max_price = data.max_price;
            }
            if ("in_stock_only" in data && data.in_stock_only != undefined) {
                this.in_stock_only = data.in_stock_only;
            }
        }
    }
    get category_id() {
        return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
    }
    set category_id(value: number) {
        pb_1.Message.setOneofField(this, 1, this.#one_of_decls[0], value);
    }
    get has_category_id() {
        return pb_1.Message.getField(this, 1) != null;
    }
    get search() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set search(value: string) {
        pb_1.Message.setOneofField(this, 2, this.#one_of_decls[1], value);
    }
    get has_search() {
        return pb_1.Message.getField(this, 2) != null;
    }
    get min_price() {
        return pb_1.Message.getFieldWithDefault(this, 3, 0) as number;
    }
    set min_price(value: number) {
        pb_1.Message.setOneofField(this, 3, this.#one_of_decls[2], value);
    }
    get has_min_price() {
        return pb_1.Message.getField(this, 3) != null;
    }
    get max_price() {
        return pb_1.Message.getFieldWithDefault(this, 4, 0) as number;
    }
    set max_price(value: number) {
        pb_1.Message.setOneofField(this, 4, this.#one_of_decls[3], value);
    }
    get has_max_price() {
        return pb_1.Message.getField(this, 4) != null;
    }
    get in_stock_only() {
        return pb_1.Message.getFieldWithDefault(this, 5, false) as boolean;
    }
    set in_stock_only(value: boolean) {
        pb_1.Message.setOneofField(this, 5, this.#one_of_decls[4], value);
    }
    get has_in_stock_only() {
        return pb_1.Message.getField(this, 5) != null;
    }
    get _category_id() {
        const cases: {
            [index: number]: "none" | "category_id";
        } = {
            0: "none",
            1: "category_id"
        };
        return cases[pb_1.Message.computeOneofCase(this, [1])];
    }
    get _search() {
        const cases: {
            [index: number]: "none" | "search";
        } = {
            0: "none",
            2: "search"
        };
        return cases[pb_1.Message.computeOneofCase(this, [2])];
    }
    get _min_price() {
        const cases: {
            [index: number]: "none" | "min_price";
        } = {
            0: "none",
            3: "min_price"
        };
        return cases[pb_1.Message.computeOneofCase(this, [3])];
    }
    get _max_price() {
        const cases: {
            [index: number]: "none" | "max_price";
        } = {
            0: "none",
            4: "max_price"
        };
        return cases[pb_1.Message.computeOneofCase(this, [4])];
    }
    get _in_stock_only() {
        const cases: {
            [index: number]: "none" | "in_stock_only";
        } = {
            0: "none",
            5: "in_stock_only"
        };
        return cases[pb_1.Message.computeOneofCase(this, [5])];
    }
    static fromObject(data: {
        category_id?: number;
        search?: string;
        min_price?: number;
        max_price?: number;
        in_stock_only?: boolean;
    }): GetPartsRequest {
        const message = new GetPartsRequest({});
        if (data.category_id != null) {
            message.category_id = data.category_id;
        }
        if (data.search != null) {
            message.search = data.search;
        }
        if (data.min_price != null) {
            message.min_price = data.min_price;
        }
        if (data.max_price != null) {
            message.max_price = data.max_price;
        }
        if (data.in_stock_only != null) {
            message.in_stock_only = data.in_stock_only;
        }
        return message;
    }
    toObject() {
        const data: {
            category_id?: number;
            search?: string;
            min_price?: number;
            max_price?: number;
            in_stock_only?: boolean;
        } = {};
        if (this.category_id != null) {
            data.category_id = this.category_id;
        }
        if (this.search != null) {
            data.search = this.search;
        }
        if (this.min_price != null) {
            data.min_price = this.min_price;
        }
        if (this.max_price != null) {
            data.max_price = this.max_price;
        }
        if (this.in_stock_only != null) {
            data.in_stock_only = this.in_stock_only;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.has_category_id)
            writer.writeInt32(1, this.category_id);
        if (this.has_search)
            writer.writeString(2, this.search);
        if (this.has_min_price)
            writer.writeDouble(3, this.min_price);
        if (this.has_max_price)
            writer.writeDouble(4, this.max_price);
        if (this.has_in_stock_only)
            writer.writeBool(5, this.in_stock_only);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetPartsRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetPartsRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.category_id = reader.readInt32();
                    break;
                case 2:
                    message.search = reader.readString();
                    break;
                case 3:
                    message.min_price = reader.readDouble();
                    break;
                case 4:
                    message.max_price = reader.readDouble();
                    break;
                case 5:
                    message.in_stock_only = reader.readBool();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): GetPartsRequest {
        return GetPartsRequest.deserialize(bytes);
    }
}
export class GetPartsResponse extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        parts?: CarPartModel[];
        total_count?: number;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("parts" in data && data.parts != undefined) {
                this.parts = data.parts;
            }
            if ("total_count" in data && data.total_count != undefined) {
                this.total_count = data.total_count;
            }
        }
    }
    get parts() {
        return pb_1.Message.getRepeatedWrapperField(this, CarPartModel, 1) as CarPartModel[];
    }
    set parts(value: CarPartModel[]) {
        pb_1.Message.setRepeatedWrapperField(this, 1, value);
    }
    get total_count() {
        return pb_1.Message.getFieldWithDefault(this, 2, 0) as number;
    }
    set total_count(value: number) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        parts?: ReturnType<typeof CarPartModel.prototype.toObject>[];
        total_count?: number;
    }): GetPartsResponse {
        const message = new GetPartsResponse({});
        if (data.parts != null) {
            message.parts = data.parts.map(item => CarPartModel.fromObject(item));
        }
        if (data.total_count != null) {
            message.total_count = data.total_count;
        }
        return message;
    }
    toObject() {
        const data: {
            parts?: ReturnType<typeof CarPartModel.prototype.toObject>[];
            total_count?: number;
        } = {};
        if (this.parts != null) {
            data.parts = this.parts.map((item: CarPartModel) => item.toObject());
        }
        if (this.total_count != null) {
            data.total_count = this.total_count;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.parts.length)
            writer.writeRepeatedMessage(1, this.parts, (item: CarPartModel) => item.serialize(writer));
        if (this.total_count != 0)
            writer.writeInt32(2, this.total_count);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetPartsResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetPartsResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    reader.readMessage(message.parts, () => pb_1.Message.addToRepeatedWrapperField(message, 1, CarPartModel.deserialize(reader), CarPartModel));
                    break;
                case 2:
                    message.total_count = reader.readInt32();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): GetPartsResponse {
        return GetPartsResponse.deserialize(bytes);
    }
}
export class GetPartByIdRequest extends pb_1.Message {
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
    }): GetPartByIdRequest {
        const message = new GetPartByIdRequest({});
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
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetPartByIdRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetPartByIdRequest();
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
    static deserializeBinary(bytes: Uint8Array): GetPartByIdRequest {
        return GetPartByIdRequest.deserialize(bytes);
    }
}
export class GetPartByIdResponse extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        part?: CarPartModel;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("part" in data && data.part != undefined) {
                this.part = data.part;
            }
        }
    }
    get part() {
        return pb_1.Message.getWrapperField(this, CarPartModel, 1) as CarPartModel;
    }
    set part(value: CarPartModel) {
        pb_1.Message.setWrapperField(this, 1, value);
    }
    get has_part() {
        return pb_1.Message.getField(this, 1) != null;
    }
    static fromObject(data: {
        part?: ReturnType<typeof CarPartModel.prototype.toObject>;
    }): GetPartByIdResponse {
        const message = new GetPartByIdResponse({});
        if (data.part != null) {
            message.part = CarPartModel.fromObject(data.part);
        }
        return message;
    }
    toObject() {
        const data: {
            part?: ReturnType<typeof CarPartModel.prototype.toObject>;
        } = {};
        if (this.part != null) {
            data.part = this.part.toObject();
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.has_part)
            writer.writeMessage(1, this.part, () => this.part.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetPartByIdResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetPartByIdResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    reader.readMessage(message.part, () => message.part = CarPartModel.deserialize(reader));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): GetPartByIdResponse {
        return GetPartByIdResponse.deserialize(bytes);
    }
}
export abstract class UnimplementedCatalogServiceService {
    static definition = {
        GetCategories: {
            path: "/carpartshop.catalog.CatalogService/GetCategories",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: GetCategoriesRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetCategoriesRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: GetCategoriesResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => GetCategoriesResponse.deserialize(new Uint8Array(bytes))
        },
        GetParts: {
            path: "/carpartshop.catalog.CatalogService/GetParts",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: GetPartsRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetPartsRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: GetPartsResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => GetPartsResponse.deserialize(new Uint8Array(bytes))
        },
        GetPartById: {
            path: "/carpartshop.catalog.CatalogService/GetPartById",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: GetPartByIdRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetPartByIdRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: GetPartByIdResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => GetPartByIdResponse.deserialize(new Uint8Array(bytes))
        }
    };
    [method: string]: grpc_1.UntypedHandleCall;
    abstract GetCategories(call: grpc_1.ServerUnaryCall<GetCategoriesRequest, GetCategoriesResponse>, callback: grpc_1.sendUnaryData<GetCategoriesResponse>): void;
    abstract GetParts(call: grpc_1.ServerUnaryCall<GetPartsRequest, GetPartsResponse>, callback: grpc_1.sendUnaryData<GetPartsResponse>): void;
    abstract GetPartById(call: grpc_1.ServerUnaryCall<GetPartByIdRequest, GetPartByIdResponse>, callback: grpc_1.sendUnaryData<GetPartByIdResponse>): void;
}
export class CatalogServiceClient {
    private _address: string;
    private _client: grpc_web_1.GrpcWebClientBase;
    constructor(address: string, credentials?: Object, options?: grpc_web_1.GrpcWebClientBaseOptions) {
        if (!options)
            options = {};
        options.format = options.format || "text";
        this._address = address;
        this._client = new grpc_web_1.GrpcWebClientBase(options);
    }
    private static GetCategories = new grpc_web_1.MethodDescriptor<GetCategoriesRequest, GetCategoriesResponse>("/carpartshop.catalog.CatalogService/GetCategories", grpc_web_1.MethodType.UNARY, GetCategoriesRequest, GetCategoriesResponse, (message: GetCategoriesRequest) => message.serialize(), GetCategoriesResponse.deserialize);
    GetCategories(message: GetCategoriesRequest, metadata: grpc_web_1.Metadata | null) {
        return this._client.thenableCall<GetCategoriesRequest, GetCategoriesResponse>(this._address + "/carpartshop.catalog.CatalogService/GetCategories", message, metadata || {}, CatalogServiceClient.GetCategories);
    }
    private static GetParts = new grpc_web_1.MethodDescriptor<GetPartsRequest, GetPartsResponse>("/carpartshop.catalog.CatalogService/GetParts", grpc_web_1.MethodType.UNARY, GetPartsRequest, GetPartsResponse, (message: GetPartsRequest) => message.serialize(), GetPartsResponse.deserialize);
    GetParts(message: GetPartsRequest, metadata: grpc_web_1.Metadata | null) {
        return this._client.thenableCall<GetPartsRequest, GetPartsResponse>(this._address + "/carpartshop.catalog.CatalogService/GetParts", message, metadata || {}, CatalogServiceClient.GetParts);
    }
    private static GetPartById = new grpc_web_1.MethodDescriptor<GetPartByIdRequest, GetPartByIdResponse>("/carpartshop.catalog.CatalogService/GetPartById", grpc_web_1.MethodType.UNARY, GetPartByIdRequest, GetPartByIdResponse, (message: GetPartByIdRequest) => message.serialize(), GetPartByIdResponse.deserialize);
    GetPartById(message: GetPartByIdRequest, metadata: grpc_web_1.Metadata | null) {
        return this._client.thenableCall<GetPartByIdRequest, GetPartByIdResponse>(this._address + "/carpartshop.catalog.CatalogService/GetPartById", message, metadata || {}, CatalogServiceClient.GetPartById);
    }
}
