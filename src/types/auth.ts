export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginResult = {
  user: {
    username: string;
    name: string;
    email: string;
  };
  tokens: Tokens;
};

export type JwtPayload = {
  userId: string;
  username: string;
};
