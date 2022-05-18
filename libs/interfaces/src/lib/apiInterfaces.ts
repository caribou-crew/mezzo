import { Profile, RouteVariant } from './dataInterfaces';

export interface GetActiveVariantsResponse {
  variants: RouteVariant[];
}

export interface ProfileResponse {
  profiles: Profile[];
}

export interface RecordedRequest {
  config: Record<string, any>;
}
export interface MezzoRecordedResponse {
  body: any;
  status: any;
  headers: any;
}
export interface MezzoRecordedRequest {
  url: any;
  method: any;
  data: any;
  headers: any;
  params: any;
}
export interface RecordedResponse {
  body: any;
  headers: Record<string, string>;
  redirected: boolean;
  status: number;
  statusText: string;
  type: string;
}

export interface SocketRequestResponseMessage {
  type: string;
  payload:
    | {
        request: MezzoRecordedRequest;
        response: MezzoRecordedResponse;
        duration: number;
      }
    | Record<string, never>;
  important: boolean;
  date: string;
  deltaTime: number;
}
