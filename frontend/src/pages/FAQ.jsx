const faqs = [
  {
    question: "Can students search by topic instead of subject?",
    answer: "Yes. Tutor profiles store subjects and topic lists, and the search API filters both fields."
  },
  {
    question: "Can teachers offer both online and physical classes?",
    answer: "Yes. Teachers can publish online, physical, or mixed class options with location and availability details."
  },
  {
    question: "How are reviews calculated?",
    answer: "Students submit ratings after completed bookings, and the backend recalculates each tutor's average rating and review count."
  },
  {
    question: "Does the platform support real-time chat?",
    answer: "Yes. Socket.io handles live messaging and notification events alongside persisted message records."
  }
];

export const FAQ = () => {
  return (
    <main className="page-shell bg-slate-50 dark:bg-slate-950">
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-slate-950 dark:text-white">FAQ</h1>
        <div className="mt-8 grid gap-4">
          {faqs.map((item) => (
            <details key={item.question} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <summary className="cursor-pointer font-bold text-slate-950 dark:text-white">{item.question}</summary>
              <p className="mt-3 leading-6 text-slate-600 dark:text-slate-300">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
};

