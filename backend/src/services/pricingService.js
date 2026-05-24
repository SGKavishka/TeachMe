const roundMoney = (value) => Math.round((Number(value) || 0) * 100) / 100;

export const calculateBookingPrice = ({ hourlyRate, durationMinutes = 60, currency = "USD", platformFeePercent = 0 }) => {
  const lessonAmount = roundMoney((Number(hourlyRate) || 0) * (Number(durationMinutes) / 60));
  const platformFee = roundMoney(lessonAmount * (Number(platformFeePercent) / 100));
  const finalPayable = roundMoney(lessonAmount + platformFee);

  return {
    lessonAmount,
    platformFee,
    teacherAmount: lessonAmount,
    finalPayable,
    currency
  };
};
