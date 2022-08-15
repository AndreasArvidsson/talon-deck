export interface ButtonConfig {
  icon: string;
  action?: string;
}

export interface Config {
  repl: string;
  buttons: ButtonConfig[];
}
