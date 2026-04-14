// Demo data for event voting - used in place of API/Supabase calls

export const DEMO_EVENT = {
  id: "demo-event-2025",
  name: "GLOW UP 2025",
  subtitle: "Year End Party",
  description: "Đêm hội tri ân và vinh danh những gương mặt tỏa sáng nhất năm.",
  date: "28/12/2025",
  venue: "GEM Center, TP.HCM",
  company: "Code4Change Media",
}

export interface DemoCandidate {
  id: string
  name: string
  description: string
  photo_url: string
}

export interface DemoCategory {
  id: string
  name: string
  description: string
  emoji: string
  max_votes_per_voter: number
  candidates: DemoCandidate[]
}

export const DEMO_CATEGORIES: DemoCategory[] = [
  {
    id: "cat-king",
    name: "King of the Night 👑",
    description: "Vinh danh anh chàng tỏa sáng nhất đêm nay",
    emoji: "👑",
    max_votes_per_voter: 1,
    candidates: [
      {
        id: "c1",
        name: "Nguyễn Minh Khoa",
        description: "Backend Developer · 3 năm",
        photo_url: "https://i.pravatar.cc/400?img=11",
      },
      {
        id: "c2",
        name: "Trần Hoàng Nam",
        description: "Product Manager · 4 năm",
        photo_url: "https://i.pravatar.cc/400?img=15",
      },
      {
        id: "c3",
        name: "Lê Văn Đức",
        description: "Frontend Lead · 5 năm",
        photo_url: "https://i.pravatar.cc/400?img=12",
      },
      {
        id: "c4",
        name: "Phạm Quốc Bảo",
        description: "DevOps Engineer · 2 năm",
        photo_url: "https://i.pravatar.cc/400?img=67",
      },
    ],
  },
  {
    id: "cat-queen",
    name: "Queen of the Night 💎",
    description: "Vinh danh cô nàng rực rỡ nhất đêm nay",
    emoji: "💎",
    max_votes_per_voter: 1,
    candidates: [
      {
        id: "c5",
        name: "Nguyễn Thị Lan Anh",
        description: "UI/UX Designer · 3 năm",
        photo_url: "https://i.pravatar.cc/400?img=47",
      },
      {
        id: "c6",
        name: "Trần Phương Linh",
        description: "Marketing Manager · 4 năm",
        photo_url: "https://i.pravatar.cc/400?img=44",
      },
      {
        id: "c7",
        name: "Lê Thị Hoa",
        description: "Content Lead · 5 năm",
        photo_url: "https://i.pravatar.cc/400?img=48",
      },
      {
        id: "c8",
        name: "Võ Ngọc Mai",
        description: "QA Engineer · 2 năm",
        photo_url: "https://i.pravatar.cc/400?img=45",
      },
    ],
  },
  {
    id: "cat-smile",
    name: "Smile Award 😊",
    description: "Người lan tỏa năng lượng tích cực nhất",
    emoji: "😊",
    max_votes_per_voter: 2,
    candidates: [
      {
        id: "c9",
        name: "Đặng Hữu Phúc",
        description: "Customer Success · 2 năm",
        photo_url: "https://i.pravatar.cc/400?img=14",
      },
      {
        id: "c10",
        name: "Bùi Thị Thu Hằng",
        description: "HR Specialist · 3 năm",
        photo_url: "https://i.pravatar.cc/400?img=49",
      },
      {
        id: "c11",
        name: "Hoàng Văn Tú",
        description: "Sales Executive · 4 năm",
        photo_url: "https://i.pravatar.cc/400?img=16",
      },
      {
        id: "c12",
        name: "Phan Thị Xuân",
        description: "Data Analyst · 2 năm",
        photo_url: "https://i.pravatar.cc/400?img=46",
      },
    ],
  },
  {
    id: "cat-creative",
    name: "Creative Star ✨",
    description: "Cá nhân sáng tạo và đột phá nhất năm",
    emoji: "✨",
    max_votes_per_voter: 2,
    candidates: [
      {
        id: "c13",
        name: "Nguyễn Duy Khang",
        description: "Fullstack Developer · 4 năm",
        photo_url: "https://i.pravatar.cc/400?img=18",
      },
      {
        id: "c14",
        name: "Trịnh Thị Bích Ngọc",
        description: "Graphic Designer · 3 năm",
        photo_url: "https://i.pravatar.cc/400?img=43",
      },
      {
        id: "c15",
        name: "Cao Văn Hùng",
        description: "Mobile Developer · 5 năm",
        photo_url: "https://i.pravatar.cc/400?img=19",
      },
      {
        id: "c16",
        name: "Đinh Thị Quỳnh Nga",
        description: "Brand Strategist · 2 năm",
        photo_url: "https://i.pravatar.cc/400?img=42",
      },
    ],
  },
]

// Initial demo vote counts (for results page)
export const DEMO_INITIAL_VOTE_COUNTS: Record<string, number> = {
  c1: 42,
  c2: 67,
  c3: 55,
  c4: 28,
  c5: 73,
  c6: 61,
  c7: 44,
  c8: 39,
  c9: 58,
  c10: 71,
  c11: 35,
  c12: 49,
  c13: 62,
  c14: 80,
  c15: 53,
  c16: 47,
}

// Compute initial stats
export const DEMO_INITIAL_STATS = {
  totalVotes: Object.values(DEMO_INITIAL_VOTE_COUNTS).reduce((a, b) => a + b, 0),
  totalVoters: 124,
  totalCategories: DEMO_CATEGORIES.length,
  totalCandidates: DEMO_CATEGORIES.reduce((sum, cat) => sum + cat.candidates.length, 0),
}
