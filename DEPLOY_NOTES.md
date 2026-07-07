# Ghi chú deploy DUCPT

Trang hiện tại là HTML tĩnh, không cần build, không cần Node.js và không cần database.

File/thư mục cần upload lên root của domain `ducpt.com`:
- `index.html`
- `assets/`

Checklist trước khi đưa lên host:
- Upload `index.html` vào thư mục public/root của domain, ví dụ `public_html`, `www` hoặc thư mục root site tương ứng.
- Upload toàn bộ thư mục `assets` cùng cấp với `index.html`.
- Đảm bảo hosting trả file với charset UTF-8.
- Kiểm tra favicon/logo DUCPT, ảnh preview dự án, icon Verba Studio và ảnh YouTube/GitHub.
- Kiểm tra các mục: Trang chủ, Dịch vụ, Dự án, Đề xuất, Giới thiệu.
- Kiểm tra bộ lọc dự án và ô tìm kiếm.
- Kiểm tra mobile: nút menu mở/đóng được và các link cuộn đúng vị trí.

Analytics:
- Trong `index.html`, tìm `ANALYTICS_CONFIG`.
- Điền `googleAnalyticsId` dạng `G-XXXXXXXXXX` để bật Google Analytics.
- Microsoft Clarity đang dùng project id `a391372641p533055026`.
- Các event đã gắn sẵn: `outbound_click`, `internal_click`, `project_card_click`, `project_filter`, `project_search`, `section_view`.

Trang có nền video từ URL bên ngoài. Nếu video không tải được, nền fallback vẫn hiển thị.
