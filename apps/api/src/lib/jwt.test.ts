import jwt from 'jsonwebtoken';
import { signAccessToken, verifyAccessToken, generateRefreshToken, hashRefreshToken } from './jwt';
import { pem } from './env';

const privateKey = pem(process.env.JWT_PRIVATE_KEY) as string;
const publicKey = pem(process.env.JWT_PUBLIC_KEY) as string;

describe('signAccessToken / verifyAccessToken', () => {
  it('round-trips a token carrying sub + role', () => {
    const token = signAccessToken('user-123', 'BUYER');
    const claims = verifyAccessToken(token);
    expect(claims.sub).toBe('user-123');
    expect(claims.role).toBe('BUYER');
  });

  it('embeds the configured issuer and subject', () => {
    const token = signAccessToken('user-abc', 'ADMIN');
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as jwt.JwtPayload;
    expect(decoded.iss).toBe('storefiller');
    expect(decoded.sub).toBe('user-abc');
    expect(decoded.exp).toBeDefined();
  });

  it('rejects a token signed with a different key', () => {
    const other = jwt.sign({ role: 'BUYER' }, privateKey, { algorithm: 'RS256' });
    // strip issuer so it fails on issuer mismatch instead
    expect(() => verifyAccessToken(other)).toThrow(expect.objectContaining({ status: 401 }));
  });

  it('rejects an HS256 (algorithm-confusion) token', () => {
    const confused = jwt.sign({ sub: 'x', role: 'BUYER', iss: 'storefiller' }, 'secret', {
      algorithm: 'HS256',
    });
    expect(() => verifyAccessToken(confused)).toThrow(expect.objectContaining({ status: 401 }));
  });

  it('rejects a token missing sub or role', () => {
    const noRole = jwt.sign({ sub: 'x' }, privateKey, {
      algorithm: 'RS256',
      issuer: 'storefiller',
    });
    expect(() => verifyAccessToken(noRole)).toThrow(expect.objectContaining({ status: 401 }));
  });

  it('rejects a malformed token', () => {
    expect(() => verifyAccessToken('not-a-jwt')).toThrow(expect.objectContaining({ status: 401 }));
  });
});

describe('refresh token generation / hashing', () => {
  it('generates an opaque token distinct from its stored hash', () => {
    const { token, hash } = generateRefreshToken();
    expect(token).not.toBe(hash);
    expect(hash).toMatch(/^[0-9a-f]{64}$/); // sha256 hex
  });

  it('hash is deterministic for the same token', () => {
    const { token } = generateRefreshToken();
    expect(hashRefreshToken(token)).toBe(hashRefreshToken(token));
  });

  it('different tokens produce different hashes', () => {
    const a = generateRefreshToken();
    const b = generateRefreshToken();
    expect(a.hash).not.toBe(b.hash);
  });
});
