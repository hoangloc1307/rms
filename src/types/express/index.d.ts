declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        allowedSections?: string[];
      };
      validatedData?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
        files?: {
          [key: string]: Express.Multer.File[];
        };
      };
    }
  }
}

export {};
