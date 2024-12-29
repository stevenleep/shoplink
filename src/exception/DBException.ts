import { HttpError } from 'routing-controllers';

export class DBException extends HttpError {
  public name: string;
  public message: string;
  public stack: any;
  public code: number;

  constructor(message: string) {
    super(500, message);
    Object.setPrototypeOf(this, DBException.prototype);

    // custom code
    this.code = 5000;

    this.name = 'DBException';
    this.message = message;
    this.stack = new Error().stack;
  }

  public toJSON() {
    return {
      code: this.code,
      name: this.name,
      message: this.message,
      stack: this.stack,
    };
  }
}
