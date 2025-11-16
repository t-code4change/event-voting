import { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { FileText, CheckCircle2, XCircle, AlertTriangle, Scale } from "lucide-react"

export const metadata: Metadata = {
  title: "Điều khoản sử dụng | Bright4Event",
  description: "Điều khoản và điều kiện sử dụng nền tảng Bright4Event - Quyền và trách nhiệm của người dùng",
  keywords: ["điều khoản sử dụng", "terms of service", "quy định sử dụng", "điều kiện dịch vụ"],
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <Header />

      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-[#FDB931]/10 border border-[#FFD700]/30 mb-6">
            <Scale className="w-8 h-8 text-[#FFD700]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Điều khoản sử dụng
          </h1>
          <p className="text-lg text-gray-400">
            Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section 1 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">1. Chấp nhận điều khoản</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Bằng việc truy cập và sử dụng nền tảng <strong className="text-white">Bright4Event</strong>,
                bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản này,
                vui lòng không sử dụng dịch vụ của chúng tôi.
              </p>
              <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-4">
                <p className="text-sm">
                  <strong className="text-[#FFD700]">Lưu ý:</strong> Điều khoản này có hiệu lực kể từ ngày bạn đăng ký tài khoản hoặc sử dụng bất kỳ dịch vụ nào của Bright4Event.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">2. Quyền của người dùng</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>Khi sử dụng Bright4Event, bạn được quyền:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Tạo và quản lý sự kiện của riêng bạn</li>
                <li>Sử dụng các tính năng check-in, bình chọn, quay số may mắn, livestream</li>
                <li>Quản lý danh sách khách mời và theo dõi thống kê realtime</li>
                <li>Xuất dữ liệu sự kiện dưới dạng Excel/PDF</li>
                <li>Tùy chỉnh giao diện màn hình LED và các tính năng hiển thị</li>
                <li>Nhận hỗ trợ kỹ thuật từ đội ngũ Bright4Event</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">3. Trách nhiệm của người dùng</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>Bạn cam kết:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-white">Cung cấp thông tin chính xác:</strong> Đảm bảo thông tin đăng ký và dữ liệu sự kiện là đúng sự thật.
                </li>
                <li>
                  <strong className="text-white">Bảo mật tài khoản:</strong> Giữ bí mật mật khẩu và thông báo ngay nếu phát hiện truy cập trái phép.
                </li>
                <li>
                  <strong className="text-white">Tuân thủ pháp luật:</strong> Không sử dụng dịch vụ cho các mục đích bất hợp pháp hoặc vi phạm quyền lợi của bên thứ ba.
                </li>
                <li>
                  <strong className="text-white">Nội dung phù hợp:</strong> Không đăng tải nội dung phản cảm, bạo lực, khiêu dâm hoặc xúc phạm.
                </li>
                <li>
                  <strong className="text-white">Thanh toán đúng hạn:</strong> Nếu sử dụng gói trả phí, đảm bảo thanh toán theo đúng thời hạn.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">4. Hành vi bị cấm</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>Các hành vi sau đây bị nghiêm cấm khi sử dụng Bright4Event:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Sao chép, sửa đổi, phân phối hoặc khai thác mã nguồn của nền tảng</li>
                <li>Tấn công hệ thống, gửi virus hoặc phần mềm độc hại</li>
                <li>Sử dụng bot, script hoặc công cụ tự động để thao tác kết quả bình chọn</li>
                <li>Thu thập dữ liệu người dùng khác mà không có sự đồng ý</li>
                <li>Mạo danh tổ chức hoặc cá nhân khác</li>
                <li>Spam, quảng cáo trái phép hoặc gửi nội dung không mong muốn</li>
              </ul>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-4">
                <p className="text-sm text-red-400">
                  <strong>Hậu quả:</strong> Vi phạm các điều khoản trên có thể dẫn đến việc tài khoản bị đình chỉ hoặc xóa vĩnh viễn mà không được hoàn lại phí.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">5. Sở hữu trí tuệ</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Tất cả quyền sở hữu trí tuệ liên quan đến nền tảng Bright4Event (giao diện, logo, tính năng, mã nguồn, nội dung)
                thuộc về <strong className="text-white">Code4Change Technology Solution</strong>.
              </p>
              <div className="space-y-2">
                <p className="text-white font-semibold">Nội dung của người dùng:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Bạn vẫn sở hữu nội dung (ảnh, video, text) mà bạn tải lên</li>
                  <li>Bạn cấp cho Bright4Event quyền sử dụng nội dung để vận hành dịch vụ</li>
                  <li>Chúng tôi có thể sử dụng dữ liệu ẩn danh để cải thiện sản phẩm</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">6. Thanh toán và hoàn tiền</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <div>
                <p className="text-white font-semibold mb-2">Gói dịch vụ:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Miễn phí:</strong> Tính năng cơ bản, giới hạn số lượng khách</li>
                  <li><strong className="text-white">Standard:</strong> Phù hợp cho sự kiện trung bình (100-500 khách)</li>
                  <li><strong className="text-white">Enterprise:</strong> Không giới hạn, hỗ trợ ưu tiên 24/7</li>
                </ul>
              </div>
              <div className="mt-4">
                <p className="text-white font-semibold mb-2">Chính sách hoàn tiền:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Hoàn 100% nếu hủy trước 7 ngày so với ngày sự kiện</li>
                  <li>Hoàn 50% nếu hủy từ 3-7 ngày trước sự kiện</li>
                  <li>Không hoàn tiền nếu hủy trong vòng 3 ngày hoặc sau khi sự kiện bắt đầu</li>
                  <li>Trường hợp lỗi kỹ thuật do Bright4Event, hoàn 100% hoặc gia hạn miễn phí</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">7. Giới hạn trách nhiệm</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Bright4Event cung cấp dịch vụ "nguyên trạng" và không đảm bảo 100% không có lỗi hoặc gián đoạn.
                Chúng tôi không chịu trách nhiệm cho:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Thiệt hại gián tiếp do lỗi hệ thống (mất dữ liệu, mất doanh thu)</li>
                <li>Lỗi do nhà cung cấp bên thứ ba (hosting, email, thanh toán)</li>
                <li>Nội dung hoặc hành vi của người dùng khác</li>
                <li>Trường hợp bất khả kháng (thiên tai, chiến tranh, dịch bệnh)</li>
              </ul>
              <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-4 mt-4">
                <p className="text-sm">
                  <strong className="text-[#FFD700]">Cam kết:</strong> Chúng tôi nỗ lực tối đa để đảm bảo hệ thống hoạt động ổn định với uptime 99.9% và hỗ trợ kỹ thuật nhanh chóng.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">8. Chấm dứt dịch vụ</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>Bright4Event có quyền:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Đình chỉ hoặc xóa tài khoản nếu phát hiện vi phạm điều khoản</li>
                <li>Ngừng cung cấp dịch vụ với thông báo trước 30 ngày</li>
                <li>Thay đổi hoặc nâng cấp tính năng mà không cần thông báo trước</li>
              </ul>
              <p className="mt-4">
                <strong className="text-white">Quyền của bạn:</strong> Bạn có thể hủy tài khoản bất kỳ lúc nào thông qua trang Cài đặt hoặc liên hệ với chúng tôi.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">9. Luật áp dụng và giải quyết tranh chấp</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng.
                Nếu không đạt được thỏa thuận, tranh chấp sẽ được giải quyết tại Tòa án có thẩm quyền tại Hà Nội, Việt Nam.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">10. Liên hệ</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Nếu bạn có bất kỳ câu hỏi nào về điều khoản sử dụng, vui lòng liên hệ:
              </p>
              <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-6 space-y-2">
                <p className="text-white">
                  <strong>Bright4Event by Code4Change Technology Solution</strong>
                </p>
                <p>Email: code4change.co@gmail.com</p>
                <p>Điện thoại: +84 901 333 434</p>
                <p>Website: bright4event.com</p>
              </div>
            </div>
          </section>
        </div>

        {/* Acceptance Notice */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#FDB931]/10 border-2 border-[#FFD700]/50 rounded-2xl p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
            <p className="text-white text-lg">
              Bằng việc sử dụng Bright4Event, bạn xác nhận đã đọc, hiểu và đồng ý với tất cả các điều khoản trên.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
