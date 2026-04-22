declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        allowedSections?: string[];
      };
      validatedData?: {
        body?: Record<string, unknown>;
        query?: unknown;
        params?: unknown;
        files?: Record<string, Express.Multer.File[]>;
      };
    }
  }
}

export {};
