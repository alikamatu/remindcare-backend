import * as jwt from 'jsonwebtoken';

export function getAuth(req: any) {
  // 1. Get the token from the Authorization header
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No authorization header');
  }
  const token = authHeader.replace('Bearer ', '');

  // 2. Verify and decode the token (replace with your Clerk public key)
  const publicKey = process.env.CLERK_JWT_PUBLIC_KEY?.replace(/\\n/g, '\n');
  if (!publicKey) throw new Error('Missing Clerk public key');

  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
}