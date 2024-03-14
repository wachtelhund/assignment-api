export class RequestError extends Error {
  status: number;
  /**
   * Creates a new RequestError.
   */
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}