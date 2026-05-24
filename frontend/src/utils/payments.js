export const formatMoney = (amount = 0, currency = "USD") => {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(Number(amount) || 0);
};

export const humanStatus = (status = "") => status.replace(/_/g, " ");

export const paymentStatusTone = (status) => {
  if (["released", "completed", "paid", "on_hold"].includes(status)) return "green";
  if (["refunded", "partially_refunded", "disputed"].includes(status)) return "amber";
  return "slate";
};
