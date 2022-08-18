export interface ActionRequest {
  repl: string;
  action?: string;
}

export interface ButtonClient {
  icon: string;
  actionId?: string;
}

export interface ButtonConfig {
  icon: string;
  action?: string;
  order?: number;
}

export interface Config {
  repl: string;
  buttons: ButtonConfig[];
}
