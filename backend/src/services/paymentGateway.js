import crypto from "crypto";
import { ApiError } from "../utils/ApiError.js";

const assertTokenizedPaymentMethod = ({ paymentMethod, paymentToken }) => {
  if (paymentMethod === "demo") return;

  if (!paymentToken) {
    throw new ApiError(400, "A tokenized payment method is required. Do not send raw card details to this API.");
  }

  if (!/^(pm_|tok_|demo_)/.test(paymentToken)) {
    throw new ApiError(400, "Invalid payment token format.");
  }
};

export const processPayment = async ({ provider, amount, currency, paymentMethod, paymentToken, idempotencyKey }) => {
  assertTokenizedPaymentMethod({ paymentMethod, paymentToken });

  if (provider !== "demo") {
    throw new ApiError(501, "Live payment provider is not configured in this environment.");
  }

  return {
    status: "paid",
    providerPaymentId: `demo_pi_${crypto.randomBytes(12).toString("hex")}`,
    idempotencyKey,
    amount,
    currency,
    risk: { score: 8, flags: [] }
  };
};

export const refundPayment = async ({ provider, amount }) => {
  if (provider !== "demo") {
    throw new ApiError(501, "Live refund provider is not configured in this environment.");
  }

  return {
    status: "refunded",
    providerRefundId: `demo_re_${crypto.randomBytes(12).toString("hex")}`,
    amount
  };
};

export const transferPayment = async ({ provider, amount }) => {
  if (provider !== "demo") {
    throw new ApiError(501, "Live payout provider is not configured in this environment.");
  }

  return {
    status: "released",
    providerTransferId: `demo_tr_${crypto.randomBytes(12).toString("hex")}`,
    amount
  };
};
