declare global {
  namespace Express {
    interface Request {
      userId?: string;
      requestId?: string;
      ip: string;
    }
  }
}
