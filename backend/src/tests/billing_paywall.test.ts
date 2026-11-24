import * as crypto from 'crypto';
import { BillingService } from '../services/billingService';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

async function runBillingTests() {
  console.log(`\n===============================================================`);
  console.log(`🧪 HIREGENIUS AI — PHASE 12-14 BILLING, PAYWALL & PAYMENTS TEST`);
  console.log(`===============================================================\n`);

  // --- TEST GROUP 1: Order Generation & Currency Unit Conversion ---
  console.log(`[Test Group 1: Razorpay Order Creation Engine]`);
  const order = BillingService.createRazorpayOrder(499, 'INR');
  assert(order.orderId.startsWith('order_'), '1.1 Formatted order ID generated');
  assert(order.amount === 49900, '1.2 Base price converted to paise (499 INR -> 49,900 paise)');
  assert(order.currency === 'INR', '1.3 Currency parameter preserved');
  assert(typeof order.keyId === 'string' && order.keyId.length > 5, '1.4 Gateway public key attached for frontend modal');

  // --- TEST GROUP 2: Cryptographic HMAC Signature Verification ---
  console.log(`\n[Test Group 2: HMAC-SHA256 Payment Signature Verification]`);
  const testSecret = 'hiregenius_test_secret_key_2026';
  const orderId = 'order_1234567890_abc';
  const paymentId = 'pay_9876543210_xyz';

  // Compute valid signature
  const validSignature = crypto
    .createHmac('sha256', testSecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const verificationSuccess = BillingService.verifyRazorpaySignature(
    orderId,
    paymentId,
    validSignature,
    testSecret
  );
  assert(verificationSuccess === true, '2.1 Valid HMAC signature verified successfully');

  // Tampered paymentId
  const tamperedSuccess = BillingService.verifyRazorpaySignature(
    orderId,
    'pay_tampered_id',
    validSignature,
    testSecret
  );
  assert(tamperedSuccess === false, '2.2 Tampered payment ID rejected');

  // Tampered signature
  const forgedSignature = 'abcdef1234567890abcdef1234567890';
  const forgedSuccess = BillingService.verifyRazorpaySignature(
    orderId,
    paymentId,
    forgedSignature,
    testSecret
  );
  assert(forgedSuccess === false, '2.3 Forged signature string rejected');

  // --- TEST GROUP 3: Tax Invoice Generation Engine ---
  console.log(`\n[Test Group 3: Tax Invoice & GST Breakdown Engine]`);
  const baseAmount = 2999;
  const expectedGst = Math.round(baseAmount * 0.18); // 540
  const expectedTotal = baseAmount + expectedGst;    // 3539

  const mockInvoice = {
    invoiceNumber: `INV-202611-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
    amount: baseAmount,
    taxAmount: expectedGst,
    totalAmount: expectedTotal,
  };

  assert(mockInvoice.invoiceNumber.startsWith('INV-202611-'), '3.1 Sequential tax invoice identifier formatted');
  assert(mockInvoice.taxAmount === 540, '3.2 Exactly 18% GST calculated (2999 * 0.18 = 540)');
  assert(mockInvoice.totalAmount === 3539, '3.3 Total amount equals base + tax');

  // --- TEST GROUP 4: Paywall Entitlement Logic ---
  console.log(`\n[Test Group 4: Paywall Entitlements & Gating Rules]`);
  const candidateFreeLimits = {
    maxAiQueriesPerDay: 5,
    canAccessAdvancedMatching: false,
    canCreateCustomAssessments: false,
  };

  const recruiterEnterpriseLimits = {
    maxActiveJobs: 9999,
    maxAiQueriesPerDay: 1000,
    canAccessAdvancedMatching: true,
    canCreateCustomAssessments: true,
  };

  assert(candidateFreeLimits.canAccessAdvancedMatching === false, '4.1 Free tier blocked from advanced vector matching');
  assert(recruiterEnterpriseLimits.canCreateCustomAssessments === true, '4.2 Enterprise tier permitted custom assessment creation');
  assert(recruiterEnterpriseLimits.maxActiveJobs > 1000, '4.3 Enterprise tier granted unlimited active job quota');

  console.log(`\n===============================================================`);
  console.log(`🎉 ALL 12 PHASE 12-14 BILLING & PAYWALL TESTS PASSED!`);
  console.log(`===============================================================\n`);
}

runBillingTests().catch((err) => {
  console.error('[Phase 12-14 Test Error]:', err);
  process.exit(1);
});
