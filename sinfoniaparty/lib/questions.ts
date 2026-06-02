// ── Quiz Questions & Game Logic ──────────────────────────────────────────────
// 17 questions for The Sunset Sinfonia Quiz Game
// Timer decreases: Q1-Q4 = 12s, Q5-Q8 = 10s, Q9-Q12 = 8s, Q13-Q17 = 6s
// Scoring: base points increase per question + speed bonus

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number; // 0-based (A=0, B=1, C=2, D=3)
  category?: string;
}

export interface GameData {
  state: "lobby" | "question" | "reveal" | "leaderboard" | "finished";
  currentQuestion: number;
  questionStartedAt: number;
  createdAt: number;
  pin: string;
}

export interface PlayerData {
  nickname: string;
  score: number;
}

export interface AnswerData {
  option: number;
  timeMs: number;
}

// ── All 17 Questions ────────────────────────────────────────────────────────

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question:
      "Wyndham Sky Lake Resort & Villas cách trung tâm Hà Nội khoảng bao lâu di chuyển?",
    options: ["20 phút", "30 phút", "55 phút", "60 phút"],
    correctIndex: 2,
    category: "Venue",
  },
  {
    id: 2,
    question: "Tên chủ đề chính của Wedding Fair năm nay là gì?",
    options: [
      "Love in Bloom",
      "The Sunset Sinfonia",
      "Wedding Symphony",
      "Forever Together",
    ],
    correctIndex: 1,
    category: "Event",
  },
  {
    id: 3,
    question: "Thông điệp chính của sự kiện năm nay là gì?",
    options: [
      "Create Luxury Weddings",
      "Wedding Beyond Expectations",
      "Celebrate The Makers Behind Every Wedding",
      "Crafting Perfect Moments",
    ],
    correctIndex: 2,
    category: "Event",
  },
  {
    id: 4,
    question:
      'Trong tên sự kiện "The Sunset Sinfonia", từ "Sinfonia" mang ý nghĩa gì?',
    options: [
      "Bản tình ca",
      "Khúc giao hưởng mở màn",
      "Bữa tiệc hoàng hôn",
      "Điệu nhảy dưới ánh chiều",
    ],
    correctIndex: 1,
    category: "Event",
  },
  {
    id: 5,
    question:
      "Không gian tại Wyndham Sky Lake được lấy cảm hứng từ đâu?",
    options: ["Santorini", "Tuscany", "Lake Como", "Maldives"],
    correctIndex: 2,
    category: "Venue",
  },
  {
    id: 6,
    question:
      "Chương đầu tiên trong hành trình trải nghiệm của The Sunset Sinfonia mang tên gì?",
    options: [
      "Catch The Sun",
      "Our First Trip As Mr & Mrs",
      "Midnight Reverie",
      "A Sky Full Of Stars",
    ],
    correctIndex: 1,
    category: "Event",
  },
  {
    id: 7,
    question:
      "Theo bạn, điều gì khiến Wyndham Sky Lake trở thành địa điểm lý tưởng cho destination wedding?",
    options: [
      "Không gian hồ nước và thiên nhiên rộng mở",
      "Gần sân bay quốc tế",
      "Trung tâm thương mại",
      "Công viên giải trí",
    ],
    correctIndex: 0,
    category: "Venue",
  },
  {
    id: 8,
    question:
      'Chương "Catch The Sun" được tổ chức vào thời điểm nào trong ngày?',
    options: ["Bình minh", "Buổi trưa", "Hoàng hôn", "Nửa đêm"],
    correctIndex: 2,
    category: "Event",
  },
  {
    id: 9,
    question:
      "Tại Wyndham Sky Lake có những lựa chọn lưu trú phù hợp cho gia đình và nhóm khách cưới nào?",
    options: [
      "Villa 2 phòng ngủ và Villa 3 phòng ngủ",
      "Bungalow đơn",
      "Lều glamping",
      "Duplex 5 tầng",
    ],
    correctIndex: 0,
    category: "Venue",
  },
  {
    id: 10,
    question:
      'Theo concept sự kiện, "Midnight Reverie" là không gian dành cho:',
    options: [
      "Workshop chuyên môn",
      "Trình diễn thời trang cưới",
      "Networking và kết nối tự nhiên",
      "Họp báo",
    ],
    correctIndex: 2,
    category: "Event",
  },
  {
    id: 11,
    question:
      "Theo bạn, yếu tố nào được Wyndham Sky Lake chú trọng nhất trong trải nghiệm cưới?",
    options: [
      "Công nghệ trình chiếu",
      "Cảm xúc và trải nghiệm cá nhân hóa",
      "Tiệc buffet quy mô lớn",
      "Hiệu ứng sân khấu",
    ],
    correctIndex: 1,
    category: "Venue",
  },
  {
    id: 12,
    question:
      "Có bao nhiêu chương trải nghiệm trong hành trình The Sunset Sinfonia?",
    options: ["3", "4", "5", "6"],
    correctIndex: 1,
    category: "Event",
  },
  // ── Menu Questions ──
  {
    id: 13,
    question: "Món khai vị đầu tiên được phục vụ tối nay là gì?",
    options: [
      "Salad cá hồi",
      "Hàu Pháp nướng phô mai",
      "Súp hải sản",
      "Bánh mì bơ tỏi",
    ],
    correctIndex: 1,
    category: "Menu",
  },
  {
    id: 14,
    question:
      "Món salad trong thực đơn tối nay được lấy cảm hứng từ ẩm thực quốc gia nào?",
    options: ["Pháp", "Ý", "Tây Ban Nha", "Hy Lạp"],
    correctIndex: 1,
    category: "Menu",
  },
  {
    id: 15,
    question: "Loại thịt được sử dụng trong món steak tối nay là:",
    options: ["Wagyu Nhật Bản", "Black Angus Úc", "Bò Mỹ Prime", "Bò Kobe"],
    correctIndex: 1,
    category: "Menu",
  },
  {
    id: 16,
    question:
      "Món tráng miệng Creme Catalane có nguồn gốc từ quốc gia nào?",
    options: ["Pháp", "Ý", "Tây Ban Nha", "Đức"],
    correctIndex: 2,
    category: "Menu",
  },
  {
    id: 17,
    question: "Loại dầu được sử dụng trong món salad hữu cơ kiểu Ý là:",
    options: ["Dầu mè", "Dầu hạt cải", "Dầu olive", "Dầu hướng dương"],
    correctIndex: 2,
    category: "Menu",
  },
];

// ── Timer Progression ───────────────────────────────────────────────────────
// Starts chill, gets increasingly urgent

export function getTimerSeconds(questionIndex: number): number {
  if (questionIndex < 4) return 12; // Q1-Q4: Warm-up
  if (questionIndex < 8) return 10; // Q5-Q8: Building pressure
  if (questionIndex < 12) return 8; // Q9-Q12: Getting intense
  return 6; // Q13-Q17: Final sprint
}

// ── Scoring System ──────────────────────────────────────────────────────────
// Later questions worth more + faster answers earn a speed bonus
//
// Base points: 100 + questionIndex * 50  →  Q1=100, Q17=900
// Speed multiplier: timeRemaining/totalTime  →  0 (last second) to 1 (instant)
// Final: basePoints * (0.5 + 0.5 * speed)
//   • Correct + instant answer  = 100% of base
//   • Correct + last second     = 50% of base
//   • Wrong answer              = 0

export function getBasePoints(questionIndex: number): number {
  return 100 + questionIndex * 50;
}

export function calculateScore(
  questionIndex: number,
  answerTimeMs: number,
  totalTimeMs: number,
  isCorrect: boolean
): number {
  if (!isCorrect) return 0;
  const base = getBasePoints(questionIndex);
  const speedRatio = Math.max(0, Math.min(1, (totalTimeMs - answerTimeMs) / totalTimeMs));
  return Math.round(base * (0.5 + 0.5 * speedRatio));
}

// ── Answer Option Colors ────────────────────────────────────────────────────
// Vintage-appropriate yet distinct colors for the 4 answer buttons

export const OPTION_COLORS = [
  { bg: "#5a6339", hover: "#6b7544", text: "#ffffff", label: "A" }, // Sage olive
  { bg: "#9e6b63", hover: "#b07d75", text: "#ffffff", label: "B" }, // Dusty rose
  { bg: "#a8893a", hover: "#bfa04e", text: "#ffffff", label: "C" }, // Warm gold
  { bg: "#5f7a8a", hover: "#718c9c", text: "#ffffff", label: "D" }, // Slate blue
];
