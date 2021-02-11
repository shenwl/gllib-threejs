export default class Logger {
  private isDebug?: boolean = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
  private prefix?: string = '[logger]';

  constructor(opts?: { prefix: string }) {
    this.prefix = opts?.prefix || this.prefix;
  }

  log = (...args: any[]) => {
    console.log(this.prefix, ...args)
  }

  warn = (...args: any[]) => {
    console.warn(this.prefix, ...args)
  }

  error = (...args: any[]) => {
    console.error(this.prefix, ...args)
  }

  debug = (...args: any[]) => {
    if(this.isDebug) {
      this.log(...args);
    }
  }
}