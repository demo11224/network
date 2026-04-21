export type Role = "user" | "assistant" | "system";

export type IntentTag = {
  id: string;
  state: "thinking" | "matched";
  label: string;
  skill?: string;
};

export interface BaseMessage {
  id: string;
  role: Role;
  createdAt: number;
}

export interface TextMessage extends BaseMessage {
  type: "text";
  content: string;
  stream?: boolean;
  thought?: string;
  intent?: IntentTag;
}

export type CarType = "economy" | "comfort" | "business";

export interface TaxiCardMessage extends BaseMessage {
  type: "taxi-card";
  origin: string;
  destination: string;
  carType: CarType;
  peopleCount: number;
  reason: string;
  status: "draft" | "dispatching" | "matched" | "done" | "cancelled";
  driver?: {
    name: string;
    plate: string;
    etaMin: number;
    rating: number;
  };
}

export interface ReceiptUploadMessage extends BaseMessage {
  type: "receipt-upload";
  state: "uploading" | "parsing" | "done";
  fileName: string;
  parsedAmount?: number;
  parsedDate?: string;
  parsedMerchant?: string;
}

export interface ReimburseCardMessage extends BaseMessage {
  type: "reimburse-card";
  title: string;
  amount: number;
  currency: string;
  occurredOn: string;
  category: string;
  merchant: string;
  description: string;
  status: "draft" | "submitting" | "approving" | "done";
}

export type Message =
  | TextMessage
  | TaxiCardMessage
  | ReceiptUploadMessage
  | ReimburseCardMessage;

export type InspectorView =
  | { kind: "empty" }
  | { kind: "skill"; skill: "taxi" | "reimburse" }
  | {
      kind: "taxi-timeline";
      taxiId: string;
    }
  | {
      kind: "oa-tree";
      reimburseId: string;
    };
