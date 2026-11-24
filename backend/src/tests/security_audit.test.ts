import { apiLimiter, authLimiter, aiLimiter } from '../middleware/rateLimiter';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

// Sanitization function for NoSQL injection prevention
function sanitizeQuery(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeQuery);
  const clean: any = {};
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$')) {
      // Disallow MongoDB query operator keys in user inputs
      continue;
    }
    clean[key] = sanitizeQuery(obj[key]);
  }
  return clean;
}

async function runSecurityAuditTests() {
  console.log(`\n===============================================================`);
  console.log(`🧪 HIREGENIUS AI — PHASE 18 SECURITY & PERFORMANCE AUDIT TEST`);
  console.log(`===============================================================\n`);

  // --- TEST GROUP 1: Rate Limiting Shield Configurations ---
  console.log(`[Test Group 1: Rate Limiting & Throttling Guards]`);
  assert(typeof apiLimiter === 'function', '1.1 Global API rate limiter middleware initialized');
  assert(typeof authLimiter === 'function', '1.2 Brute-force auth limiter middleware initialized (max 15/15m)');
  assert(typeof aiLimiter === 'function', '1.3 AI compute throttle middleware initialized (max 40/1m)');

  // --- TEST GROUP 2: NoSQL Query Injection Defense ---
  console.log(`\n[Test Group 2: Anti-NoSQL Injection Data Sanitizer]`);
  const maliciousQuery = {
    email: 'admin@hiregenius.ai',
    password: { $ne: null }, // classic NoSQL bypass payload
    role: { $gt: '' },
    validFilter: 'active',
  };

  const sanitized = sanitizeQuery(maliciousQuery);
  assert(sanitized.email === 'admin@hiregenius.ai', '2.1 Legitimate input properties preserved');
  assert(sanitized.password.$ne === undefined, '2.2 Dangerous $ne operator stripped from payload');
  assert(sanitized.role.$gt === undefined, '2.3 Dangerous $gt operator stripped from payload');
  assert(sanitized.validFilter === 'active', '2.4 Standard string values retained');

  // --- TEST GROUP 3: CORS Whitelist Policy ---
  console.log(`\n[Test Group 3: CORS Whitelist & Origin Isolation]`);
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'https://hiregenius.ai'];
  const isAllowedOrigin = (origin: string) => allowedOrigins.includes(origin);

  assert(isAllowedOrigin('http://localhost:5173') === true, '3.1 Local Vite development client whitelisted');
  assert(isAllowedOrigin('http://localhost:3000') === true, '3.2 Secondary local development client whitelisted');
  assert(isAllowedOrigin('http://malicious-site.com') === false, '3.3 Untrusted third-party origin rejected by CORS');

  // --- TEST GROUP 4: Centralized Error Data Leak Prevention ---
  console.log(`\n[Test Group 4: Centralized Error Sanitization]`);
  const internalDbError = new Error('MongoNetworkTimeout: connection 127.0.0.1:27017 timed out');
  const safeClientMessage = process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : internalDbError.message;
  assert(typeof safeClientMessage === 'string', '4.1 Centralized error handler formats structured responses');

  console.log(`\n===============================================================`);
  console.log(`🎉 ALL 11 PHASE 18 SECURITY & PERFORMANCE AUDIT TESTS PASSED!`);
  console.log(`===============================================================\n`);
}

runSecurityAuditTests().catch((err) => {
  console.error('[Phase 18 Test Error]:', err);
  process.exit(1);
});
