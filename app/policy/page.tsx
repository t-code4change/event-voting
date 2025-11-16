import { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Shield, Lock, Eye, FileText, Mail, Database } from "lucide-react"

export const metadata: Metadata = {
  title: "Chính sách bảo mật | Bright4Event",
  description: "Chính sách bảo mật dữ liệu và quyền riêng tư của người dùng trên nền tảng Bright4Event",
  keywords: ["chính sách bảo mật", "privacy policy", "bảo mật dữ liệu", "quyền riêng tư"],
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <Header />

      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-[#FDB931]/10 border border-[#FFD700]/30 mb-6">
            <Shield className="w-8 h-8 text-[#FFD700]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Chính sách bảo mật
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
              <Eye className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">1. Thu thập thông tin</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Bright4Event thu thập các thông tin sau để cung cấp dịch vụ tốt nhất cho bạn:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-white">Thông tin cá nhân:</strong> Họ tên, email, số điện thoại, công ty khi bạn đăng ký tài khoản hoặc tham gia sự kiện.
                </li>
                <li>
                  <strong className="text-white">Thông tin sự kiện:</strong> Dữ liệu về sự kiện bạn tạo, danh sách khách mời, kết quả bình chọn, ảnh/video tải lên.
                </li>
                <li>
                  <strong className="text-white">Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, thiết bị, thời gian truy cập để tối ưu trải nghiệm.
                </li>
                <li>
                  <strong className="text-white">Cookie:</strong> Sử dụng cookie để duy trì phiên đăng nhập và cải thiện hiệu suất website.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">2. Sử dụng thông tin</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>Chúng tôi sử dụng thông tin của bạn để:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cung cấp và vận hành các tính năng của nền tảng Bright4Event</li>
                <li>Gửi thông báo về sự kiện, cập nhật hệ thống và hỗ trợ kỹ thuật</li>
                <li>Phân tích và cải thiện chất lượng dịch vụ</li>
                <li>Ngăn chặn gian lận và đảm bảo an toàn hệ thống</li>
                <li>Tuân thủ các quy định pháp luật hiện hành</li>
              </ul>
              <p className="mt-4">
                <strong className="text-white">Cam kết:</strong> Chúng tôi{" "}
                <span className="text-[#FFD700]">không bán</span> thông tin cá nhân của bạn cho bên thứ ba.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">3. Bảo mật dữ liệu</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Bright4Event áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-white">Mã hóa SSL/TLS:</strong> Tất cả dữ liệu truyền tải được mã hóa.
                </li>
                <li>
                  <strong className="text-white">Mã hóa mật khẩu:</strong> Sử dụng bcrypt để băm mật khẩu.
                </li>
                <li>
                  <strong className="text-white">Firewall & Monitoring:</strong> Giám sát 24/7 để phát hiện và ngăn chặn truy cập trái phép.
                </li>
                <li>
                  <strong className="text-white">Sao lưu định kỳ:</strong> Backup dữ liệu thường xuyên để phòng tránh mất mát.
                </li>
                <li>
                  <strong className="text-white">Phân quyền truy cập:</strong> Chỉ nhân viên có thẩm quyền mới được tiếp cận dữ liệu nhạy cảm.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">4. Chia sẻ thông tin</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Chúng tôi chỉ chia sẻ thông tin của bạn trong các trường hợp sau:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-white">Với sự đồng ý của bạn:</strong> Khi bạn cho phép chia sẻ với đối tác hoặc nhà tổ chức sự kiện.
                </li>
                <li>
                  <strong className="text-white">Với nhà cung cấp dịch vụ:</strong> Email, lưu trữ cloud, thanh toán (tuân thủ GDPR).
                </li>
                <li>
                  <strong className="text-white">Yêu cầu pháp lý:</strong> Khi có lệnh từ cơ quan nhà nước có thẩm quyền.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">5. Quyền của người dùng</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>Bạn có các quyền sau đối với dữ liệu cá nhân của mình:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-white">Quyền truy cập:</strong> Xem thông tin cá nhân đã cung cấp.
                </li>
                <li>
                  <strong className="text-white">Quyền chỉnh sửa:</strong> Cập nhật hoặc sửa đổi thông tin không chính xác.
                </li>
                <li>
                  <strong className="text-white">Quyền xóa:</strong> Yêu cầu xóa tài khoản và dữ liệu liên quan (trừ dữ liệu cần lưu trữ theo pháp luật).
                </li>
                <li>
                  <strong className="text-white">Quyền rút lại sự đồng ý:</strong> Ngừng nhận email marketing bất kỳ lúc nào.
                </li>
                <li>
                  <strong className="text-white">Quyền khiếu nại:</strong> Liên hệ với chúng tôi nếu có lo ngại về quyền riêng tư.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">6. Liên hệ</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc về chính sách bảo mật này, vui lòng liên hệ:
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

          {/* Section 7 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">7. Thay đổi chính sách</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Mọi thay đổi sẽ được thông báo qua email hoặc trên website. Việc bạn tiếp tục sử dụng dịch vụ sau khi thay đổi có nghĩa là bạn chấp nhận chính sách mới.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
