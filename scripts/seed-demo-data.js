/**
 * Seed Demo Data Script
 * Creates demo event with categories and candidates
 *
 * Usage: node scripts/seed-demo-data.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🌱 Seeding Demo Data...\n')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedData() {
  try {
    // Check if event already exists
    const { data: existingEvents } = await supabase
      .from('events')
      .select('id')
      .eq('name', 'King & Queen of the Night 2025')
      .limit(1)

    if (existingEvents && existingEvents.length > 0) {
      console.log('✅ Demo data already exists!')
      console.log('Event ID:', existingEvents[0].id)
      return
    }

    console.log('1️⃣ Creating event...')
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        name: 'King & Queen of the Night 2025',
        description: 'Chào mừng bạn đến với sự kiện bình chọn King & Queen of the Night 2025! Hãy chọn những ứng viên yêu thích của bạn.',
        voting_start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        voting_end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 days
        is_active: true,
        auth_settings: {
          require_email: true,
          require_phone: false,
          require_otp: false,
        },
      })
      .select()
      .single()

    if (eventError) throw eventError
    console.log('✅ Event created:', event.id)

    // Create categories
    console.log('\n2️⃣ Creating categories...')
    const categories = [
      {
        event_id: event.id,
        name: 'King of the Night',
        description: 'Nam giới quyến rũ nhất đêm nay',
        emoji: '🤴',
        max_votes_per_voter: 3,
        display_order: 1,
      },
      {
        event_id: event.id,
        name: 'Queen of the Night',
        description: 'Nữ giới quyến rũ nhất đêm nay',
        emoji: '👸',
        max_votes_per_voter: 3,
        display_order: 2,
      },
      {
        event_id: event.id,
        name: 'Best Dressed',
        description: 'Người mặc đẹp nhất',
        emoji: '👔',
        max_votes_per_voter: 2,
        display_order: 3,
      },
    ]

    const { data: createdCategories, error: categoriesError } = await supabase
      .from('categories')
      .insert(categories)
      .select()

    if (categoriesError) throw categoriesError
    console.log('✅ Categories created:', createdCategories.length)

    // Create candidates
    console.log('\n3️⃣ Creating candidates...')
    const [kingCategory, queenCategory, dressCategory] = createdCategories

    const candidates = [
      // Kings
      { category_id: kingCategory.id, name: 'Nguyễn Văn A', description: 'Software Engineer, yêu thích công nghệ và âm nhạc', display_order: 1 },
      { category_id: kingCategory.id, name: 'Trần Minh B', description: 'Product Manager, đam mê du lịch và nhiếp ảnh', display_order: 2 },
      { category_id: kingCategory.id, name: 'Lê Hoàng C', description: 'UX Designer, yêu thích nghệ thuật và thể thao', display_order: 3 },
      { category_id: kingCategory.id, name: 'Phạm Đức D', description: 'Data Analyst, thích đọc sách và chơi guitar', display_order: 4 },
      { category_id: kingCategory.id, name: 'Hoàng Tuấn E', description: 'Marketing Manager, yêu thích ẩm thực và du lịch', display_order: 5 },

      // Queens
      { category_id: queenCategory.id, name: 'Nguyễn Thị X', description: 'Marketing Lead, đam mê thời trang và làm đẹp', display_order: 1 },
      { category_id: queenCategory.id, name: 'Trần Thu Y', description: 'HR Manager, yêu thích yoga và thiền', display_order: 2 },
      { category_id: queenCategory.id, name: 'Lê Hương Z', description: 'Business Analyst, thích đọc sách và du lịch', display_order: 3 },
      { category_id: queenCategory.id, name: 'Phạm Mai K', description: 'Content Creator, đam mê nhiếp ảnh và viết lách', display_order: 4 },
      { category_id: queenCategory.id, name: 'Hoàng Linh L', description: 'Sales Director, yêu thích thể thao và âm nhạc', display_order: 5 },

      // Best Dressed
      { category_id: dressCategory.id, name: 'Nguyễn Văn A', description: 'Style: Classic & Elegant', display_order: 1 },
      { category_id: dressCategory.id, name: 'Nguyễn Thị X', description: 'Style: Modern & Chic', display_order: 2 },
      { category_id: dressCategory.id, name: 'Trần Minh B', description: 'Style: Casual & Cool', display_order: 3 },
      { category_id: dressCategory.id, name: 'Lê Hoàng C', description: 'Style: Trendy & Bold', display_order: 4 },
      { category_id: dressCategory.id, name: 'Trần Thu Y', description: 'Style: Graceful & Feminine', display_order: 5 },
      { category_id: dressCategory.id, name: 'Phạm Đức D', description: 'Style: Smart & Professional', display_order: 6 },
    ]

    const { data: createdCandidates, error: candidatesError } = await supabase
      .from('candidates')
      .insert(candidates)
      .select()

    if (candidatesError) throw candidatesError
    console.log('✅ Candidates created:', createdCandidates.length)

    console.log('\n🎉 Demo data seeded successfully!')
    console.log('\n📊 Summary:')
    console.log('   - 1 Event (active)')
    console.log('   - 3 Categories')
    console.log('   - 16 Candidates')
    console.log('\n🚀 Ready to use!')
    console.log('   Vote: http://localhost:3000/vote')
    console.log('   Admin: http://localhost:3000/admin/dashboard')
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

seedData()
