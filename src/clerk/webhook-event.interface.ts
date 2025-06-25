export interface WebhookEvent {
  type: string;
  data: {
    id: string;
    [key: string]: any;
  };
  [key: string]: any;
}