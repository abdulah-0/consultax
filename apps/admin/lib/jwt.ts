import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret-key-at-least-32-chars-long-for-security';
const JWT_SECRET = new TextEncoder().encode(SECRET_KEY);

export async function signToken(payload: { id: string; email: string; role: string; name: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Sessions last for 7 days
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as { id: string; email: string; role: string; name: string; exp: number };
  } catch (error) {
    return null;
  }
}
