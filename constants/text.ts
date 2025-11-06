// Text constants and messages
export const MESSAGES = {
  // Success messages
  SUCCESS: {
    PAYMENT_COMPLETE: 'Thanh toán thành công!',
    SUBSCRIPTION_CREATED: 'Tạo subscription thành công!',
    INVOICE_UPDATED: 'Cập nhật hóa đơn thành công!',
    PACKAGE_SAVED: 'Lưu gói dịch vụ thành công!',
    LOGIN_SUCCESS: 'Đăng nhập thành công!',
    REGISTER_SUCCESS: 'Đăng ký thành công!',
  },

  // Error messages
  ERROR: {
    GENERIC: 'Có lỗi xảy ra. Vui lòng thử lại.',
    UNAUTHORIZED: 'Bạn không có quyền truy cập.',
    LOGIN_FAILED: 'Email hoặc mật khẩu không đúng',
    REGISTER_FAILED: 'Email đã được đăng ký. Vui lòng đăng nhập.',
    REQUIRED_FIELDS: 'Vui lòng điền đầy đủ thông tin',
    INVALID_EMAIL: 'Email không hợp lệ',
    PASSWORD_TOO_SHORT: 'Mật khẩu phải có ít nhất 6 ký tự',
    NETWORK_ERROR: 'Lỗi kết nối. Vui lòng kiểm tra internet.',
  },

  // Labels
  LABELS: {
    EMAIL: 'Email',
    PASSWORD: 'Mật khẩu',
    COMPANY_NAME: 'Tên công ty',
    TAX_CODE: 'Mã số thuế',
    ADDRESS: 'Địa chỉ',
    PHONE: 'Số điện thoại',
    INVOICE_EMAIL: 'Email nhận hóa đơn',
  },

  // Buttons
  BUTTONS: {
    LOGIN: 'Đăng nhập',
    REGISTER: 'Đăng ký',
    LOGOUT: 'Đăng xuất',
    SUBMIT: 'Xác nhận',
    CANCEL: 'Hủy',
    SAVE: 'Lưu',
    DELETE: 'Xóa',
    EDIT: 'Chỉnh sửa',
    VIEW: 'Xem',
    DOWNLOAD: 'Tải xuống',
    UPGRADE: 'Nâng cấp',
    RENEW: 'Gia hạn',
    ACTIVATE: 'Kích hoạt',
    BACK_TO_HOME: 'Về trang chủ',
    PAYMENT_CONFIRMED: 'Đã chuyển khoản',
    CANCEL_PAYMENT: 'Hủy thanh toán',
    LOGIN_WITH_GOOGLE: 'Đăng nhập với Google',
  },

  // Placeholders
  PLACEHOLDERS: {
    EMAIL: 'your@email.com',
    PASSWORD: '••••••••',
    COMPANY_NAME: 'Công ty ABC',
    TAX_CODE: '0123456789',
    SEARCH: 'Tìm kiếm...',
  },
} as const

export const TITLES = {
  WELCOME_BACK: 'Chào mừng trở lại',
  CREATE_ACCOUNT: 'Tạo tài khoản mới',
  MY_SUBSCRIPTION: 'Subscription Của Tôi',
  ADMIN_PANEL: 'Admin Panel',
  PACKAGE_MANAGEMENT: 'Quản lý Gói Dịch Vụ',
  SUBSCRIPTION_MANAGEMENT: 'Quản lý Subscriptions',
  INVOICE_MANAGEMENT: 'Quản lý Hóa Đơn',
  ANALYTICS: 'Analytics & Dashboard',
} as const
