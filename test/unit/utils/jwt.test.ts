jest.mock('~/configs/env.config', () => ({
  env: {
    JWT_ACCESS_SECRET: 'test-access-secret',
    JWT_REFRESH_SECRET: 'test-refresh-secret',
    JWT_ACCESS_TOKEN_EXPIRY: '1h',
    JWT_REFRESH_TOKEN_EXPIRY: '7d',
  },
}));

import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '~/utils/jwt';

describe('JWT utils', () => {
  test('Generate and verify access token', () => {
    const token = generateAccessToken({
      userId: '12314092',
      roles: ['MANAGER:2120'],
    });

    const decoded = verifyAccessToken(token);

    expect(decoded.userId).toBe('12314092');
    expect(decoded.roles).toContain('MANAGER:2120');
  });

  test('Throw error for invalid token', () => {
    expect(() => verifyAccessToken('invalid')).toThrow();
  });

  test('Generate and verify refresh token', () => {
    const token = generateRefreshToken('12314092');

    const decoded = verifyRefreshToken(token);

    expect(decoded.userId).toBe('12314092');
  });
});
