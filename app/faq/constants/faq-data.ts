/**
 * FAQ Data for Bright4Event
 * Organized by categories for better user navigation
 */

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQCategory {
  title: string
  icon: string
  questions: FAQItem[]
}

export const faqData: FAQCategory[] = [
  {
    title: 'A. Tổng quan về Bright4Event',
    icon: '🎯',
    questions: [
      {
        question: 'Bright4Event là gì?',
        answer: 'Bright4Event là nền tảng bình chọn và tương tác sự kiện chuyên nghiệp hàng đầu Việt Nam. Chúng tôi cung cấp giải pháp toàn diện cho Gala, Company Party, Year-end Party với các tính năng: Check-in QR Code, Vote realtime, Lucky Draw, và hiển thị kết quả trực tiếp lên màn hình LED.'
      },
      {
        question: 'Có thể tổ chức sự kiện gì bằng Bright4Event?',
        answer: 'Bright4Event phù hợp với mọi loại sự kiện doanh nghiệp: Gala Dinner, Company Party, Year-end Party, Award Ceremony, Team Building, Product Launch, Conference, và các sự kiện nội bộ khác. Hệ thống linh hoạt từ 50 đến 5000+ khách mời.'
      },
      {
        question: 'Bright4Event khác gì so với các nền tảng khác?',
        answer: 'Bright4Event tập trung 100% vào sự kiện doanh nghiệp với: (1) Giao diện sang trọng, có thể custom branding, (2) Check-in QR code nhanh chóng, (3) Vote realtime hiển thị trực tiếp lên LED, (4) Lucky Draw công bằng minh bạch, (5) Hỗ trợ kỹ thuật 24/7 tại sự kiện.'
      }
    ]
  },
  {
    title: 'B. Tạo & Quản lý Sự kiện',
    icon: '⚙️',
    questions: [
      {
        question: 'Làm sao để tạo sự kiện đầu tiên?',
        answer: 'Rất đơn giản! (1) Đăng ký tài khoản tại Bright4Event.vn, (2) Chọn gói dịch vụ phù hợp, (3) Điền thông tin sự kiện, upload logo và theme màu, (4) Thêm danh hiệu bình chọn và ứng viên, (5) Kích hoạt và chia sẻ link/QR code cho khách mời. Toàn bộ chỉ mất 15 phút!'
      },
      {
        question: 'Có thể chỉnh sửa thông tin sự kiện sau khi public không?',
        answer: 'Có! Bạn có thể chỉnh sửa hầu hết thông tin sự kiện bất cứ lúc nào: tên sự kiện, mô tả, ảnh banner, danh hiệu bình chọn, thời gian. Tuy nhiên, với gói Enterprise, bạn nên liên hệ team support để được tư vấn cách tối ưu nhất.'
      },
      {
        question: 'Làm thế nào để thêm danh hiệu bình chọn?',
        answer: 'Truy cập Dashboard → Chọn sự kiện → Tab "Danh hiệu" → Nhấn "Thêm danh hiệu mới" → Nhập tên danh hiệu, mô tả, upload ảnh ứng viên → Lưu lại. Bạn có thể thêm không giới hạn danh hiệu và ứng viên tùy theo gói dịch vụ.'
      },
      {
        question: 'Có thể giới hạn số lượt vote cho mỗi người không?',
        answer: 'Có! Bright4Event cho phép bạn cài đặt: (1) Số lượt vote tối đa mỗi người (ví dụ: 3 lượt), (2) Vote 1 lần cho mỗi danh hiệu, (3) Chỉ cho phép vote sau khi check-in. Điều này giúp đảm bảo tính công bằng và minh bạch.'
      }
    ]
  },
  {
    title: 'C. Thanh toán & Gói dịch vụ',
    icon: '💳',
    questions: [
      {
        question: 'Có những gói nào? Thanh toán như thế nào?',
        answer: 'Bright4Event có 3 gói: (1) Basic (50-200 khách) - 2.990.000đ, (2) Pro (200-500 khách) - 4.990.000đ, (3) Enterprise (500+ khách) - Liên hệ. Thanh toán qua Chuyển khoản ngân hàng, VNPay, hoặc Momo. Xuất hóa đơn VAT đầy đủ.'
      },
      {
        question: 'Có hỗ trợ xuất hóa đơn VAT không?',
        answer: 'Có! Chúng tôi xuất hóa đơn VAT đầy đủ cho mọi gói dịch vụ. Sau khi thanh toán, bạn chỉ cần cung cấp thông tin công ty (tên, MST, địa chỉ), chúng tôi sẽ gửi hóa đơn điện tử trong vòng 24h.'
      },
      {
        question: 'Có được hoàn tiền nếu sự kiện bị hủy không?',
        answer: 'Có, với chính sách: (1) Hủy trước 7 ngày: hoàn 100%, (2) Hủy trước 3-7 ngày: hoàn 70%, (3) Hủy trong vòng 3 ngày: hoàn 50%. Nếu sự kiện bị hoãn, bạn có thể đổi ngày miễn phí.'
      },
      {
        question: 'Có gói dùng thử (trial) không?',
        answer: 'Có! Chúng tôi có gói Free Trial 14 ngày cho tối đa 50 khách. Bạn có thể test đầy đủ tính năng: check-in QR, vote, lucky draw, analytics. Không cần thẻ tín dụng để đăng ký.'
      }
    ]
  },
  {
    title: 'D. Kỹ thuật & Hỗ trợ',
    icon: '🛠️',
    questions: [
      {
        question: 'Làm sao hiển thị kết quả lên LED?',
        answer: 'Rất đơn giản! (1) Mở Dashboard trên laptop, (2) Chọn "Chế độ LED", (3) Kết nối laptop với màn hình LED/máy chiếu qua HDMI, (4) Nhấn F11 để fullscreen. Kết quả sẽ tự động cập nhật realtime. Chúng tôi cũng hỗ trợ kỹ thuật tại chỗ cho gói Enterprise.'
      },
      {
        question: 'Nếu bị lỗi kết nối, hệ thống xử lý thế nào?',
        answer: 'Bright4Event có cơ chế backup tự động: (1) Dữ liệu vote được lưu trên server cloud AWS, (2) Nếu mất kết nối, vote vẫn được lưu offline trên thiết bị, (3) Khi kết nối lại, dữ liệu tự động đồng bộ. Chúng tôi đảm bảo 99.9% uptime.'
      },
      {
        question: 'Có hỗ trợ 24/7 không?',
        answer: 'Có! Chúng tôi có đội ngũ hỗ trợ 24/7 qua: (1) Hotline: (+84) 901 333 434, (2) Email: code4change.co@gmail.com, (3) Live chat trên website, (4) Hỗ trợ kỹ thuật tại chỗ cho gói Enterprise. Thời gian phản hồi trung bình < 5 phút.'
      },
      {
        question: 'Bright4Event có tích hợp API không?',
        answer: 'Có! Gói Enterprise hỗ trợ API để tích hợp với hệ thống nội bộ của bạn: (1) Đồng bộ danh sách khách mời, (2) Xuất dữ liệu vote, (3) Webhook realtime. Tài liệu API đầy đủ tại docs.Bright4Event.vn'
      },
      {
        question: 'Dữ liệu có được bảo mật không?',
        answer: 'Tất nhiên! Bright4Event tuân thủ nghiêm ngặt: (1) Mã hóa SSL/TLS 256-bit, (2) Lưu trữ trên AWS Singapore, (3) Backup tự động hàng ngày, (4) Không chia sẻ dữ liệu với bên thứ ba, (5) Tuân thủ GDPR và PDPA. Dữ liệu của bạn luôn an toàn.'
      }
    ]
  }
]
