-- Seed data với ảnh người thật cho demo
-- Chạy script này trong Supabase SQL Editor

-- 1. Tạo event
INSERT INTO events (id, name, description, voting_start_time, voting_end_time, is_active, auth_settings, allow_edit_before_deadline)
VALUES (
  'demo-event-1',
  'Gala 20 năm - King & Queen of the Night 2025',
  'Đêm gala hoành tráng kỷ niệm 20 năm thành lập công ty',
  NOW(),
  NOW() + INTERVAL '7 days',
  true,
  '{"require_email": true, "require_phone": false, "require_otp": false}'::jsonb,
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active;

-- 2. Tạo categories
INSERT INTO categories (id, event_id, name, emoji, description, max_votes_per_voter, display_order)
VALUES
  ('cat-king', 'demo-event-1', 'King of the Night', '👑',
   'Bình chọn cho nam nhân viên xuất sắc nhất - người có phong cách, tài năng và đóng góp nổi bật cho công ty',
   3, 1),
  ('cat-queen', 'demo-event-1', 'Queen of the Night', '👸',
   'Bình chọn cho nữ nhân viên xuất sắc nhất - người truyền cảm hứng, tài năng và có đóng góp to lớn',
   3, 2),
  ('cat-dressed', 'demo-event-1', 'Best Dressed', '✨',
   'Bình chọn cho người có phong cách thời trang ấn tượng và nổi bật nhất trong sự kiện',
   2, 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 3. Xóa candidates cũ nếu có
DELETE FROM candidates WHERE category_id IN ('cat-king', 'cat-queen', 'cat-dressed');

-- 4. Thêm King candidates với ảnh người thật
INSERT INTO candidates (id, category_id, name, photo_url, description, display_order)
VALUES
  ('king-1', 'cat-king', 'Nguyễn Văn Minh',
   'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces',
   'Giám đốc Kinh doanh - 8 năm kinh nghiệm, đạt doanh số cao nhất năm 2024', 1),

  ('king-2', 'cat-king', 'Trần Hoàng Anh',
   'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop&crop=faces',
   'Trưởng phòng IT - Chuyên gia công nghệ, dẫn dắt team phát triển hệ thống mới', 2),

  ('king-3', 'cat-king', 'Lê Quốc Tuấn',
   'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop&crop=faces',
   'Manager Marketing - Sáng tạo, đam mê và có nhiều chiến dịch thành công', 3),

  ('king-4', 'cat-king', 'Phạm Đức Thắng',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
   'Trưởng phòng Tài chính - Chuyên gia về chiến lược tài chính doanh nghiệp', 4),

  ('king-5', 'cat-king', 'Vũ Minh Tuấn',
   'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&crop=faces',
   'Senior Developer - Coding master, mentor của nhiều junior developers', 5),

  ('king-6', 'cat-king', 'Hoàng Minh Đức',
   'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces',
   'Team Lead Operations - Tối ưu quy trình, nâng cao hiệu suất làm việc', 6);

-- 5. Thêm Queen candidates với ảnh người thật
INSERT INTO candidates (id, category_id, name, photo_url, description, display_order)
VALUES
  ('queen-1', 'cat-queen', 'Nguyễn Thị Hương',
   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces',
   'HR Director - Người xây dựng văn hóa doanh nghiệp và chăm sóc đội ngũ', 1),

  ('queen-2', 'cat-queen', 'Trần Thanh Mai',
   'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces',
   'Marketing Manager - Sáng tạo content viral, xây dựng thương hiệu mạnh mẽ', 2),

  ('queen-3', 'cat-queen', 'Lê Thị Lan Anh',
   'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=faces',
   'Product Manager - Visionary leader, dẫn dắt sản phẩm mới thành công', 3),

  ('queen-4', 'cat-queen', 'Phạm Thùy Linh',
   'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=faces',
   'Sales Director - Top performer, luôn vượt chỉ tiêu và truyền động lực', 4),

  ('queen-5', 'cat-queen', 'Đỗ Thu Hà',
   'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&h=400&fit=crop&crop=faces',
   'UX Designer - Người tạo ra những trải nghiệm người dùng tuyệt vời', 5),

  ('queen-6', 'cat-queen', 'Bùi Minh Châu',
   'https://images.unsplash.com/photo-1618835962148-cf177563c6c0?w=400&h=400&fit=crop&crop=faces',
   'Customer Success Lead - Người bạn đồng hành tận tâm của khách hàng', 6);

-- 6. Thêm Best Dressed candidates với ảnh người thật
INSERT INTO candidates (id, category_id, name, photo_url, description, display_order)
VALUES
  ('dressed-1', 'cat-dressed', 'Nguyễn Quỳnh Anh',
   'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=400&h=400&fit=crop&crop=faces',
   'Fashion icon của công ty - Luôn mang đến phong cách thanh lịch và sang trọng', 1),

  ('dressed-2', 'cat-dressed', 'Trần Minh Khoa',
   'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces',
   'Gentleman phong độ - Suit game luôn on point, phong cách lịch lãm', 2),

  ('dressed-3', 'cat-dressed', 'Lê Thị Bảo Ngọc',
   'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=400&fit=crop&crop=faces',
   'Fashionista - Mix đồ sáng tạo, luôn dẫn đầu xu hướng', 3),

  ('dressed-4', 'cat-dressed', 'Phạm Hoàng Long',
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces',
   'Modern gentleman - Phong cách hiện đại, trẻ trung nhưng vẫn lịch sự', 4);

-- Hiển thị kết quả
SELECT 'Đã seed thành công!' as message;
SELECT COUNT(*) as total_candidates FROM candidates;
SELECT name, COUNT(c.id) as candidate_count
FROM categories cat
LEFT JOIN candidates c ON c.category_id = cat.id
WHERE cat.event_id = 'demo-event-1'
GROUP BY cat.name, cat.display_order
ORDER BY cat.display_order;
