-- =============================================
-- SEED DATA - Test Event with Candidates
-- =============================================

-- Insert test event
INSERT INTO events (
    name,
    description,
    voting_start_time,
    voting_end_time,
    is_active,
    auth_settings
) VALUES (
    'King & Queen of the Night 2025',
    'Chào mừng bạn đến với sự kiện bình chọn King & Queen of the Night 2025! Hãy chọn những ứng viên yêu thích của bạn.',
    NOW() - INTERVAL '1 day',  -- Started yesterday
    NOW() + INTERVAL '7 days',  -- Ends in 7 days
    true,
    '{"require_email": true, "require_phone": false, "require_otp": false}'::jsonb
)
RETURNING id;

-- Save the event_id (you'll need to replace this with actual UUID after running above)
-- For now, let's assume we get the ID and use it below

-- Get the event ID
DO $$
DECLARE
    event_uuid UUID;
    king_category_uuid UUID;
    queen_category_uuid UUID;
    best_dress_category_uuid UUID;
BEGIN
    -- Get the event we just created
    SELECT id INTO event_uuid FROM events WHERE name = 'King & Queen of the Night 2025' LIMIT 1;

    -- Insert categories
    INSERT INTO categories (event_id, name, description, emoji, max_votes_per_voter, display_order)
    VALUES (event_uuid, 'King of the Night', 'Nam hoàng quyến rũ nhất đêm nay', '🤴', 3, 1)
    RETURNING id INTO king_category_uuid;

    INSERT INTO categories (event_id, name, description, emoji, max_votes_per_voter, display_order)
    VALUES (event_uuid, 'Queen of the Night', 'Nữ hoàng quyến rũ nhất đêm nay', '👸', 3, 2)
    RETURNING id INTO queen_category_uuid;

    INSERT INTO categories (event_id, name, description, emoji, max_votes_per_voter, display_order)
    VALUES (event_uuid, 'Best Dressed', 'Người mặc đẹp nhất', '👔', 2, 3)
    RETURNING id INTO best_dress_category_uuid;

    -- Insert candidates for "King of the Night"
    INSERT INTO candidates (category_id, name, description, display_order) VALUES
    (king_category_uuid, 'Nguyễn Văn A', 'Software Engineer, yêu thích công nghệ và âm nhạc', 1),
    (king_category_uuid, 'Trần Minh B', 'Product Manager, đam mê du lịch và nhiếp ảnh', 2),
    (king_category_uuid, 'Lê Hoàng C', 'UX Designer, yêu thích nghệ thuật và thể thao', 3),
    (king_category_uuid, 'Phạm Đức D', 'Data Analyst, thích đọc sách và chơi guitar', 4),
    (king_category_uuid, 'Hoàng Tuấn E', 'Marketing Manager, yêu thích ẩm thực và du lịch', 5);

    -- Insert candidates for "Queen of the Night"
    INSERT INTO candidates (category_id, name, description, display_order) VALUES
    (queen_category_uuid, 'Nguyễn Thị X', 'Marketing Lead, đam mê thời trang và làm đẹp', 1),
    (queen_category_uuid, 'Trần Thu Y', 'HR Manager, yêu thích yoga và thiền', 2),
    (queen_category_uuid, 'Lê Hương Z', 'Business Analyst, thích đọc sách và du lịch', 3),
    (queen_category_uuid, 'Phạm Mai K', 'Content Creator, đam mê nhiếp ảnh và viết lách', 4),
    (queen_category_uuid, 'Hoàng Linh L', 'Sales Director, yêu thích thể thao và âm nhạc', 5);

    -- Insert candidates for "Best Dressed"
    INSERT INTO candidates (category_id, name, description, display_order) VALUES
    (best_dress_category_uuid, 'Nguyễn Văn A', 'Style: Classic & Elegant', 1),
    (best_dress_category_uuid, 'Nguyễn Thị X', 'Style: Modern & Chic', 2),
    (best_dress_category_uuid, 'Trần Minh B', 'Style: Casual & Cool', 3),
    (best_dress_category_uuid, 'Lê Hoàng C', 'Style: Trendy & Bold', 4),
    (best_dress_category_uuid, 'Trần Thu Y', 'Style: Graceful & Feminine', 5),
    (best_dress_category_uuid, 'Phạm Đức D', 'Style: Smart & Professional', 6);

    RAISE NOTICE 'Seed data inserted successfully!';
    RAISE NOTICE 'Event ID: %', event_uuid;
    RAISE NOTICE 'King Category ID: %', king_category_uuid;
    RAISE NOTICE 'Queen Category ID: %', queen_category_uuid;
    RAISE NOTICE 'Best Dressed Category ID: %', best_dress_category_uuid;
END $$;

-- Verify data
SELECT 'Events:' as table_name, COUNT(*) as count FROM events
UNION ALL
SELECT 'Categories:', COUNT(*) FROM categories
UNION ALL
SELECT 'Candidates:', COUNT(*) FROM candidates;

-- Show event details
SELECT
    e.name as event_name,
    e.is_active,
    e.voting_start_time,
    e.voting_end_time,
    COUNT(DISTINCT c.id) as categories_count,
    COUNT(DISTINCT cand.id) as candidates_count
FROM events e
LEFT JOIN categories c ON c.event_id = e.id
LEFT JOIN candidates cand ON cand.category_id = c.id
WHERE e.name = 'King & Queen of the Night 2025'
GROUP BY e.id, e.name, e.is_active, e.voting_start_time, e.voting_end_time;

-- =============================================
-- COMPLETED
-- =============================================
-- Test data created successfully!
-- You can now test the application with:
-- - 1 active event
-- - 3 categories (King, Queen, Best Dressed)
-- - 16 total candidates
-- - Auth settings: Email required, no phone, no OTP
