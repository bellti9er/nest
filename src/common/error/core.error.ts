import { ErrorEntity } from "../entity/error.entity";

export class CoreError extends Error {
  protected api         : string;
  protected errorHandle : object;
  protected status      : number;

  errorHandler(message: string): ErrorEntity {
    const error = this.errorHandle[message];

    if(!error) {
      return {
        id: `Out.of.control.error`,
        message
      };
    }

    return error;
  }
}
