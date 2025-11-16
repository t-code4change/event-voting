import {
  Calendar, Users, QrCode, Monitor, Presentation, Vote, Trophy,
  Gift, Gamepad2, BarChart3, Layers, Palette, Code, Wifi
} from "lucide-react"

/**
 * Organizer steps data with detailed content for modal
 * Each step represents a phase in event organization
 */
export const organizerStepsData = [
  {
    id: 1,
    icon: Calendar,
    title: "Tạo sự kiện",
    description: "Chọn gói phù hợp, tạo event ID, nhập thông tin chi tiết, upload logo và chọn theme màu sắc theo phong cách thương hiệu của bạn.",
    intro: "Tạo event mới: đặt tên, chọn ngày-giờ, địa điểm và upload logo.",
    actions: [
      "Chọn gói phù hợp (Free/Pro/Enterprise)",
      "Điền tên sự kiện, mô tả ngắn",
      "Upload logo (PNG nền trong) và cover image (16:9)",
      "Chọn màu chủ đạo và preview live"
    ],
    tip: "Nên dùng cover 1920×1080 để hiển thị đẹp trên LED"
  },
  {
    id: 2,
    icon: Users,
    title: "Quản lý khách mời",
    description: "Import danh sách khách mời từ Excel, gửi email mời tự động, tạo QR code check-in cá nhân hóa cho từng khách.",
    intro: "Import danh sách khách mời từ Excel, gửi email mời tự động.",
    actions: [
      "Tải template Excel và điền thông tin khách mời",
      "Import file Excel vào hệ thống",
      "Gửi email mời tự động với QR code cá nhân",
      "Theo dõi trạng thái confirm/decline realtime"
    ],
    tip: "Sử dụng trường 'Tag' để phân loại khách VIP, media, đối tác"
  },
  {
    id: 3,
    icon: QrCode,
    title: "Thiết lập Check-in",
    description: "Cấu hình cổng check-in QR, tùy chỉnh thông điệp chào mừng, kết nối máy quét và in thẻ khách tự động.",
    intro: "Cấu hình luồng check-in: QR / SĐT / Mã mời.",
    actions: [
      "Bật/tắt phương thức check-in (QR, SĐT, Mã mời)",
      "Tùy chỉnh form check-in (SĐT, Email, Ghi chú)",
      "Tạo QR cá nhân hoặc QR chung cho cổng",
      "Test preview trên mockup mobile",
      "Kết nối máy quét QR hoặc tablet check-in"
    ],
    tip: "Đặt chuyển hướng sau check-in sang giao diện voting để tối ưu trải nghiệm"
  },
  {
    id: 4,
    icon: Monitor,
    title: "Màn hình Welcome LED",
    description: "Thiết kế giao diện chào mừng chuyên nghiệp, hiển thị logo doanh nghiệp, chạy slideshow ảnh và video giới thiệu.",
    intro: "Thiết kế giao diện chào mừng chuyên nghiệp với logo và slideshow.",
    actions: [
      "Upload logo doanh nghiệp (SVG/PNG trong suốt)",
      "Thêm background image hoặc video loop",
      "Tạo slideshow ảnh giới thiệu (tối đa 10 ảnh)",
      "Cài đặt thời gian chuyển slide (3-8 giây)",
      "Preview fullscreen trên LED"
    ],
    tip: "Dùng video format MP4 H.264 để tối ưu hiệu năng trên màn LED"
  },
  {
    id: 5,
    icon: Presentation,
    title: "Waiting Screen",
    description: "Tạo không khí chờ đợi hấp dẫn với countdown timer, slideshow động, music background và thông báo sự kiện.",
    intro: "Tạo không khí chờ đợi hấp dẫn với countdown timer và slideshow động.",
    actions: [
      "Cài đặt countdown timer đến thời điểm bắt đầu",
      "Upload slideshow ảnh/video waiting (loop)",
      "Thêm background music (MP3/AAC)",
      "Hiển thị thông báo sự kiện (ticker text)",
      "Schedule tự động chuyển sang giao diện tiếp theo"
    ],
    tip: "Nên chuẩn bị playlist nhạc nền 30-60 phút để tránh lặp lại"
  },
  {
    id: 6,
    icon: Vote,
    title: "Bình chọn trực tuyến",
    description: "Cấu hình danh hiệu vote, upload ảnh ứng viên chất lượng cao, set giới hạn vote và quy tắc bình chọn công bằng.",
    intro: "Cấu hình danh hiệu vote, upload ảnh ứng viên chất lượng cao.",
    actions: [
      "Tạo danh mục bình chọn (King, Queen, Best Smile...)",
      "Upload ảnh ứng viên (khuyến nghị 1:1, 800×800px)",
      "Set giới hạn vote mỗi người (1-3 lựa chọn)",
      "Cài đặt thời gian mở/đóng bình chọn",
      "Bật/tắt hiển thị kết quả realtime"
    ],
    tip: "Ẩn kết quả tạm thời để tạo hồi hộp, công bố khi sự kiện đạt đỉnh cao"
  },
  {
    id: 7,
    icon: Trophy,
    title: "Công bố kết quả",
    description: "Hiển thị kết quả realtime trên LED với hiệu ứng podium, confetti rực rỡ và âm thanh chúc mừng sống động.",
    intro: "Hiển thị kết quả realtime trên LED với hiệu ứng podium, confetti rực rỡ.",
    actions: [
      "Chọn layout hiển thị (Podium 3D, Leaderboard, Chart)",
      "Cài đặt hiệu ứng confetti (màu, mật độ)",
      "Thêm âm thanh chúc mừng (applause, fanfare)",
      "Schedule tự động công bố từng giải thưởng",
      "Kết nối với màn hình LED qua link fullscreen"
    ],
    tip: "Test âm thanh và hiệu ứng trước sự kiện để đảm bảo mượt mà"
  },
  {
    id: 8,
    icon: Gift,
    title: "Quay số Lucky Draw",
    description: "Tạo vòng quay may mắn chuyên nghiệp với hiệu ứng 3D, âm thanh kịch tính, nhiều vòng quay và giải thưởng phong phú.",
    intro: "Thiết lập vòng quay: upload danh sách, chọn hạng, số lượt quay.",
    actions: [
      "Chọn danh sách người tham gia (chỉ người đã check-in)",
      "Cài đặt số vòng quay cho từng giải thưởng",
      "Tùy chỉnh giao diện wheel/slot machine",
      "Thêm âm thanh trống/nhạc nền kịch tính",
      "Test preview và save kết quả quay số"
    ],
    tip: "Chuẩn bị âm thanh trống/nhạc nền trong thư mục assets để tăng không khí"
  },
  {
    id: 9,
    icon: Gamepad2,
    title: "Mini Game tương tác",
    description: "Tích hợp các mini game: Quiz realtime, Trivia, Spin Wheel, Bingo để tăng engagement và tạo không khí sôi động.",
    intro: "Tích hợp các mini game: Quiz realtime, Trivia, Spin Wheel.",
    actions: [
      "Chọn loại game (Quiz, Trivia, Bingo, Spin Wheel)",
      "Tạo câu hỏi và đáp án (Quiz/Trivia)",
      "Cài đặt thời gian trả lời và điểm thưởng",
      "Hiển thị leaderboard realtime trên LED",
      "Xuất kết quả và trao giải tự động"
    ],
    tip: "Quiz 10-15 câu là tối ưu, tránh quá dài làm khách chán"
  },
  {
    id: 10,
    icon: BarChart3,
    title: "Phân tích & Báo cáo",
    description: "Xem analytics chi tiết, export dữ liệu Excel/CSV, phân tích engagement theo thời gian và tạo báo cáo tổng kết.",
    intro: "Xem analytics chi tiết, export dữ liệu Excel/CSV, phân tích engagement.",
    actions: [
      "Xem dashboard tổng quan (votes, check-ins, engagement)",
      "Phân tích biểu đồ theo thời gian (timeline chart)",
      "Export dữ liệu Excel/CSV đầy đủ",
      "Tạo báo cáo PDF tổng kết sự kiện",
      "Share report link với stakeholders"
    ],
    tip: "Export data ngay sau sự kiện để lưu trữ và phân tích sâu hơn"
  }
]

/**
 * Advanced features for enterprise and professional users
 */
export const advancedFeatures = [
  {
    icon: Layers,
    title: "Quản lý nhiều sự kiện cùng lúc (Multi-event)",
    description: "Tổ chức và điều phối nhiều sự kiện song song với bảng điều khiển trung tâm. Chuyển đổi giữa các sự kiện dễ dàng, quản lý từng chi tiết một cách chuyên nghiệp và hiệu quả.",
  },
  {
    icon: Palette,
    title: "Custom branding (Logo, màu chủ đạo)",
    description: "Tùy chỉnh hoàn toàn giao diện theo thương hiệu của bạn. Upload logo, chọn màu chủ đạo, font chữ và background để tạo trải nghiệm độc đáo và nhất quán với identity của doanh nghiệp.",
  },
  {
    icon: Code,
    title: "Tích hợp API & xuất dữ liệu",
    description: "Kết nối Bright4Event với hệ thống CRM, ERP của bạn thông qua API. Xuất dữ liệu vote, check-in và analytics ra nhiều định dạng (JSON, CSV, Excel) để phân tích sâu hơn.",
  },
  {
    icon: Gift,
    title: "Quay số trúng thưởng (Lucky Draw)",
    description: "Tạo không khí sôi động với tính năng quay số may mắn chuyên nghiệp. Hiệu ứng đẹp mắt, âm thanh sống động, và hỗ trợ nhiều vòng quay với các giải thưởng khác nhau.",
  },
  {
    icon: Wifi,
    title: "Kết nối LED Realtime",
    description: "Hiển thị kết quả bình chọn và quay số trực tiếp lên màn hình LED với độ trễ tối thiểu. Hỗ trợ nhiều độ phân giải và tùy chỉnh layout hiển thị theo yêu cầu sân khấu.",
  },
]

/**
 * Frequently Asked Questions
 */
export const faqs = [
  {
    question: "Làm sao để tạo sự kiện đầu tiên?",
    answer: "Đăng nhập vào tài khoản, chọn gói phù hợp từ trang Pricing, sau đó truy cập Dashboard và nhấn 'Tạo sự kiện mới'. Điền thông tin cơ bản, upload logo và bạn đã sẵn sàng!",
  },
  {
    question: "Có thể thay đổi màu giao diện sự kiện không?",
    answer: "Có, bạn có thể tùy chỉnh hoàn toàn màu sắc, logo và theme trong phần Settings của sự kiện. Gói Premium và Enterprise còn hỗ trợ custom branding sâu hơn.",
  },
  {
    question: "Làm sao hiển thị kết quả realtime?",
    answer: "Truy cập phần 'Kết quả' trong Dashboard sự kiện, chọn chế độ 'Hiển thị trực tiếp' và copy link. Mở link này trên trình duyệt kết nối với màn hình LED hoặc máy chiếu.",
  },
  {
    question: "Có thể xuất dữ liệu vote ra Excel không?",
    answer: "Có, trong phần Analytics của mỗi sự kiện, bạn có thể xuất dữ liệu vote, check-in và thống kê ra các định dạng Excel (.xlsx), CSV hoặc JSON chỉ với một cú click.",
  },
  {
    question: "Hỗ trợ kỹ thuật 24/7 ở đâu?",
    answer: "Chúng tôi cung cấp hỗ trợ qua email (code4change.co@gmail.com), live chat trong ứng dụng và hotline dành cho khách hàng Premium/Enterprise. Thời gian phản hồi trung bình dưới 2 giờ.",
  },
]
