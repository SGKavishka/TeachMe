export const mockTutors = [
  {
    _id: "math-mentor",
    user: {
      name: "Ariana Miller",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"
    },
    headline: "Advanced mathematics tutor for exams and foundations",
    bio: "Builds clear study paths for algebra, calculus, statistics, and exam preparation.",
    subjects: [{ subject: "Mathematics", category: "STEM", topics: ["Algebra", "Calculus", "Statistics"] }],
    pricing: { hourlyRate: 28, currency: "USD" },
    classModes: { online: true, physical: true },
    location: { city: "New York", country: "United States" },
    ratingAverage: 4.9,
    ratingCount: 126,
    isVerified: true
  },
  {
    _id: "physics-lab",
    user: {
      name: "Daniel Chen",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
    },
    headline: "Physics lessons with simulation-based practice",
    bio: "Teaches mechanics, electricity, and modern physics using applied problem sessions.",
    subjects: [{ subject: "Physics", category: "Science", topics: ["Mechanics", "Electricity", "Optics"] }],
    pricing: { hourlyRate: 35, currency: "USD" },
    classModes: { online: true, physical: false },
    location: { city: "Austin", country: "United States" },
    ratingAverage: 4.8,
    ratingCount: 98,
    isVerified: true
  },
  {
    _id: "english-coach",
    user: {
      name: "Maya Fernando",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80"
    },
    headline: "English, essay writing, and presentation coaching",
    bio: "Helps learners turn unclear drafts into persuasive essays and confident speaking.",
    subjects: [{ subject: "English", category: "Languages", topics: ["Essay Writing", "Grammar", "Speaking"] }],
    pricing: { hourlyRate: 22, currency: "USD" },
    classModes: { online: true, physical: true },
    location: { city: "Colombo", country: "Sri Lanka" },
    ratingAverage: 4.7,
    ratingCount: 74,
    isVerified: false
  },
  {
    _id: "code-guide",
    user: {
      name: "Noah Williams",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
    },
    headline: "Programming mentor for web development and CS basics",
    bio: "Covers JavaScript, React, Node.js, data structures, and portfolio projects.",
    subjects: [{ subject: "Computer Science", category: "Technology", topics: ["React", "Node.js", "Algorithms"] }],
    pricing: { hourlyRate: 42, currency: "USD" },
    classModes: { online: true, physical: false },
    location: { city: "San Francisco", country: "United States" },
    ratingAverage: 5,
    ratingCount: 151,
    isVerified: true
  },
  {
    _id: "chemistry-pro",
    user: {
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80"
    },
    headline: "Chemistry tutor for organic, physical, and lab concepts",
    bio: "Explains chemistry through visual reaction maps, practice problems, and exam-focused revision.",
    subjects: [{ subject: "Chemistry", category: "Science", topics: ["Organic Chemistry", "Stoichiometry", "Chemical Bonding"] }],
    pricing: { hourlyRate: 30, currency: "USD" },
    classModes: { online: true, physical: true },
    location: { city: "Toronto", country: "Canada" },
    ratingAverage: 4.8,
    ratingCount: 89,
    isVerified: true
  },
  {
    _id: "biology-coach",
    user: {
      name: "Elena Rossi",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
    },
    headline: "Biology lessons for school, exams, and medical foundations",
    bio: "Covers cell biology, genetics, human physiology, and structured revision plans.",
    subjects: [{ subject: "Biology", category: "Science", topics: ["Genetics", "Human Biology", "Cell Biology"] }],
    pricing: { hourlyRate: 26, currency: "USD" },
    classModes: { online: true, physical: false },
    location: { city: "Milan", country: "Italy" },
    ratingAverage: 4.9,
    ratingCount: 112,
    isVerified: true
  },
  {
    _id: "business-mentor",
    user: {
      name: "Marcus Johnson",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80"
    },
    headline: "Business studies, accounting, and entrepreneurship tutor",
    bio: "Helps students understand business models, accounting basics, marketing, and case studies.",
    subjects: [{ subject: "Business Studies", category: "Business", topics: ["Accounting", "Marketing", "Entrepreneurship"] }],
    pricing: { hourlyRate: 32, currency: "USD" },
    classModes: { online: true, physical: true },
    location: { city: "London", country: "United Kingdom" },
    ratingAverage: 4.6,
    ratingCount: 67,
    isVerified: false
  },
  {
    _id: "history-guide",
    user: {
      name: "Sofia Alvarez",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
    },
    headline: "History tutor for essays, timelines, and source analysis",
    bio: "Builds clear timelines and teaches students how to write stronger history responses.",
    subjects: [{ subject: "History", category: "Arts", topics: ["World History", "Essay Writing", "Source Analysis"] }],
    pricing: { hourlyRate: 24, currency: "USD" },
    classModes: { online: true, physical: false },
    location: { city: "Madrid", country: "Spain" },
    ratingAverage: 4.7,
    ratingCount: 53,
    isVerified: true
  },
  {
    _id: "design-tutor",
    user: {
      name: "Liam Brooks",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
    },
    headline: "Design and digital media tutor for creative portfolios",
    bio: "Guides students through graphic design, UI basics, visual storytelling, and portfolio projects.",
    subjects: [{ subject: "Digital Design", category: "Arts", topics: ["Graphic Design", "UI Design", "Portfolio"] }],
    pricing: { hourlyRate: 38, currency: "USD" },
    classModes: { online: true, physical: true },
    location: { city: "Melbourne", country: "Australia" },
    ratingAverage: 4.8,
    ratingCount: 91,
    isVerified: true
  }
];

export const categories = ["STEM", "Science", "Languages", "Technology", "Business", "Arts"];
