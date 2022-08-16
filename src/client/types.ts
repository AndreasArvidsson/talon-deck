export interface ButtonConfig {
  icon: string;
  action?: string;
  order?: number;
}

export interface Config {
  repl: string;
  buttons: ButtonConfig[];
}
