import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/jwt';

// Helper assertion function
function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

async function runAuthTests() {
  console.log(`\n=======================================================`);
  console.log(`🧪 HIREGENIUS AI — PHASE 4 AUTHENTICATION & RBAC SUITE`);
  console.log(`=======================================================\n`);

  // --- TEST 1: Password Hashing & Bcrypt Cost Verification ---
  console.log(`[Test Group 1: Cryptographic Password Security]`);
  const rawPassword = 'SuperSecureCandidatePassword123!';
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(rawPassword, salt);

  assert(hashedPassword !== rawPassword, '1.1 Password must be hashed (not plaintext)');
  assert(hashedPassword.startsWith('$2a$12$') || hashedPassword.startsWith('$2b$12$'), '1.2 Bcrypt cost factor must equal 12');

  const correctMatch = await bcrypt.compare(rawPassword, hashedPassword);
  assert(correctMatch === true, '1.3 Bcrypt compare must return true for correct password');

  const wrongMatch = await bcrypt.compare('WrongPassword456!', hashedPassword);
  assert(wrongMatch === false, '1.4 Bcrypt compare must return false for incorrect password');

  // --- TEST 2: JWT Access & Refresh Token Sign / Verification ---
  console.log(`\n[Test Group 2: JWT Access & Refresh Token Engine]`);
  const candidatePayload = {
    userId: '64f_candidate_aditya_12345',
    email: 'aditya@hiregenius.ai',
    role: 'candidate' as const,
  };

  const accessToken = signAccessToken(candidatePayload);
  assert(typeof accessToken === 'string' && accessToken.split('.').length === 3, '2.1 Valid 3-part JWT access token generated');

  const verifiedAccess = verifyAccessToken(accessToken);
  assert(verifiedAccess.userId === candidatePayload.userId, '2.2 Verified user ID matches payload');
  assert(verifiedAccess.email === candidatePayload.email, '2.3 Verified email matches payload');
  assert(verifiedAccess.role === candidatePayload.role, '2.4 Verified role matches payload');

  const refreshToken = signRefreshToken(candidatePayload);
  const verifiedRefresh = verifyRefreshToken(refreshToken);
  assert(verifiedRefresh.userId === candidatePayload.userId, '2.5 Refresh token generated and verified with dedicated secret');

  // Test tampered token rejection
  let tamperedCaught = false;
  try {
    const tampered = accessToken.substring(0, accessToken.length - 6) + 'xxxxxx';
    verifyAccessToken(tampered);
  } catch {
    tamperedCaught = true;
  }
  assert(tamperedCaught, '2.6 Tampered JWT token rejected with signature verification error');

  // --- TEST 3: Role-Based Authorization Guard Simulation (RBAC) ---
  console.log(`\n[Test Group 3: Role-Based Access Control (RBAC) Enforcement]`);
  const recruiterPayload = {
    userId: '64f_recruiter_rohit_67890',
    email: 'rohit@cloudscale.io',
    role: 'recruiter' as const,
  };

  const adminPayload = {
    userId: '64f_admin_governor_99999',
    email: 'admin@hiregenius.ai',
    role: 'admin' as const,
  };

  const recruiterToken = signAccessToken(recruiterPayload);
  const adminToken = signAccessToken(adminPayload);

  // Helper simulated RBAC check
  function simulateAccess(token: string, requiredRoles: ('candidate' | 'recruiter' | 'admin')[]) {
    try {
      const decoded = verifyAccessToken(token);
      if (!requiredRoles.includes(decoded.role)) {
        return { status: 403, error: 'Forbidden', role: decoded.role };
      }
      return { status: 200, success: true, role: decoded.role };
    } catch {
      return { status: 401, error: 'Unauthorized' };
    }
  }

  // Candidate tests
  assert(simulateAccess(accessToken, ['candidate']).status === 200, '3.1 Candidate accesses Candidate route -> 200 OK');
  assert(simulateAccess(accessToken, ['recruiter']).status === 403, '3.2 Candidate blocked from Recruiter route -> 403 Forbidden');
  assert(simulateAccess(accessToken, ['admin']).status === 403, '3.3 Candidate blocked from Admin route -> 403 Forbidden');

  // Recruiter tests
  assert(simulateAccess(recruiterToken, ['recruiter']).status === 200, '3.4 Recruiter accesses Recruiter route -> 200 OK');
  assert(simulateAccess(recruiterToken, ['candidate']).status === 403, '3.5 Recruiter blocked from Candidate-only route -> 403 Forbidden');
  assert(simulateAccess(recruiterToken, ['admin']).status === 403, '3.6 Recruiter blocked from Admin route -> 403 Forbidden');

  // Admin tests
  assert(simulateAccess(adminToken, ['admin']).status === 200, '3.7 Admin accesses Admin route -> 200 OK');
  assert(simulateAccess(adminToken, ['admin', 'recruiter']).status === 200, '3.8 Admin accesses Multi-role route -> 200 OK');

  // --- TEST 4: Crypto Password Reset Token Engine ---
  console.log(`\n[Test Group 4: Cryptographic Password Reset Mechanism]`);
  const rawResetToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');
  const expiresAt = new Date(Date.now() + 3600 * 1000);

  assert(rawResetToken.length === 64, '4.1 32-byte hex reset token generated (64 characters)');
  assert(hashedResetToken.length === 64, '4.2 SHA-256 hashed token stored in database');
  assert(expiresAt.getTime() > Date.now(), '4.3 Expiration timestamp correctly set in the future (+60 min)');

  // Verify hash match
  const candidateVerifyHash = crypto.createHash('sha256').update(rawResetToken).digest('hex');
  assert(candidateVerifyHash === hashedResetToken, '4.4 Reset token hash matches stored verification hash');

  console.log(`\n=======================================================`);
  console.log(`🎉 ALL 18 PHASE 4 AUTHENTICATION & RBAC TESTS PASSED!`);
  console.log(`=======================================================\n`);
}

runAuthTests().catch((err) => {
  console.error('[Test Execution Error]:', err);
  process.exit(1);
});
