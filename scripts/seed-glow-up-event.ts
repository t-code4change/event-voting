import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Use a fixed event ID for GLOW UP 2025
const EVENT_ID = 'd112584a-4c6e-47fa-a4da-df1e3488d374'
const USER_ID = '6b007e5f-2498-447c-b7e8-e42ce8a02cc1' // Using an existing user

// Categories for GLOW UP 2025
const categories = [
  {
    name: 'King of the Night 2025',
    emoji: '👑',
    description: 'Nam nhân viên tỏa sáng nhất năm',
    max_votes_per_voter: 1,
    display_order: 1,
    event_id: EVENT_ID
  },
  {
    name: 'Queen of the Night 2025',
    emoji: '👸',
    description: 'Nữ nhân viên tỏa sáng nhất năm',
    max_votes_per_voter: 1,
    display_order: 2,
    event_id: EVENT_ID
  },
  {
    name: 'Best Smile Award',
    emoji: '😄',
    description: 'Nụ cười rạng rỡ nhất',
    max_votes_per_voter: 2,
    display_order: 3,
    event_id: EVENT_ID
  },
  {
    name: 'Most Creative',
    emoji: '🎨',
    description: 'Người sáng tạo nhất',
    max_votes_per_voter: 2,
    display_order: 4,
    event_id: EVENT_ID
  }
]

// Candidates for King category
const kingCandidates = [
  { name: 'Nguyễn Văn An', description: 'Senior Developer', photo_url: 'https://i.pravatar.cc/400?img=12', display_order: 1 },
  { name: 'Trần Minh Tuấn', description: 'Product Manager', photo_url: 'https://i.pravatar.cc/400?img=13', display_order: 2 },
  { name: 'Lê Hoàng Nam', description: 'Tech Lead', photo_url: 'https://i.pravatar.cc/400?img=14', display_order: 3 },
  { name: 'Phạm Quốc Bảo', description: 'Full Stack Developer', photo_url: 'https://i.pravatar.cc/400?img=15', display_order: 4 },
  { name: 'Vũ Đức Huy', description: 'DevOps Engineer', photo_url: 'https://i.pravatar.cc/400?img=17', display_order: 5 },
]

// Candidates for Queen category
const queenCandidates = [
  { name: 'Nguyễn Thị Mai', description: 'UI/UX Designer', photo_url: 'https://i.pravatar.cc/400?img=5', display_order: 1 },
  { name: 'Trần Hương Giang', description: 'Marketing Manager', photo_url: 'https://i.pravatar.cc/400?img=9', display_order: 2 },
  { name: 'Lê Thanh Hà', description: 'HR Manager', photo_url: 'https://i.pravatar.cc/400?img=10', display_order: 3 },
  { name: 'Phạm Thu Hiền', description: 'Frontend Developer', photo_url: 'https://i.pravatar.cc/400?img=20', display_order: 4 },
  { name: 'Hoàng Lan Anh', description: 'Content Creator', photo_url: 'https://i.pravatar.cc/400?img=23', display_order: 5 },
]

// Candidates for Best Smile
const smileCandidates = [
  { name: 'Đỗ Minh Châu', description: 'Customer Success', photo_url: 'https://i.pravatar.cc/400?img=16', display_order: 1 },
  { name: 'Bùi Thanh Tùng', description: 'Sales Executive', photo_url: 'https://i.pravatar.cc/400?img=18', display_order: 2 },
  { name: 'Ngô Thu Trang', description: 'Office Manager', photo_url: 'https://i.pravatar.cc/400?img=24', display_order: 3 },
  { name: 'Võ Quang Hải', description: 'Business Analyst', photo_url: 'https://i.pravatar.cc/400?img=33', display_order: 4 },
]

// Candidates for Most Creative
const creativeCandidates = [
  { name: 'Đinh Thị Hương', description: 'Graphic Designer', photo_url: 'https://i.pravatar.cc/400?img=25', display_order: 1 },
  { name: 'Lý Minh Khoa', description: 'Creative Director', photo_url: 'https://i.pravatar.cc/400?img=31', display_order: 2 },
  { name: 'Trương Văn Đạt', description: 'Video Editor', photo_url: 'https://i.pravatar.cc/400?img=32', display_order: 3 },
  { name: 'Cao Thu Phương', description: 'Social Media Manager', photo_url: 'https://i.pravatar.cc/400?img=27', display_order: 4 },
]

async function seedData() {
  console.log('🌱 Starting to seed GLOW UP 2025 event data...')

  try {
    // 0. Create or update the event
    console.log('🎭 Creating GLOW UP 2025 event...')

    const eventData = {
      id: EVENT_ID,
      name: 'GLOW UP 2025 - Year End Party',
      description: 'Year End Party của Code4Change Media - Tỏa sáng cùng những khoảnh khắc đáng nhớ',
      user_id: USER_ID,
      code: 'GLOW2025',
      voting_start_time: new Date('2025-12-28T18:00:00+07:00').toISOString(),
      voting_end_time: new Date('2025-12-28T21:00:00+07:00').toISOString(),
      is_active: true,
      auth_settings: {
        require_otp: false,
        require_email: false,
        require_phone: true
      },
      settings: {
        theme: 'glow',
        colors: {
          primary: '#FFD700',
          secondary: '#FDB931'
        },
        features: {
          allow_comments: false,
          require_registration: true,
          show_results_realtime: true
        }
      }
    }

    // Try to insert, if exists, update
    const { error: eventError } = await supabase
      .from('events')
      .upsert(eventData, { onConflict: 'id' })

    if (eventError) {
      throw new Error(`Failed to create event: ${eventError.message}`)
    }

    console.log('✅ Event created/updated')

    // 1. Delete existing data for this event
    console.log('🗑️  Cleaning up existing data...')

    const { data: existingCategories } = await supabase
      .from('categories')
      .select('id')
      .eq('event_id', EVENT_ID)

    if (existingCategories && existingCategories.length > 0) {
      const categoryIds = existingCategories.map(c => c.id)

      // Delete votes
      await supabase.from('votes').delete().in('category_id', categoryIds)

      // Delete candidates
      await supabase.from('candidates').delete().in('category_id', categoryIds)

      // Delete categories
      await supabase.from('categories').delete().eq('event_id', EVENT_ID)

      console.log('✅ Cleaned up existing data')
    }

    // 2. Create categories
    console.log('📁 Creating categories...')
    const { data: createdCategories, error: categoriesError } = await supabase
      .from('categories')
      .insert(categories)
      .select()

    if (categoriesError) {
      throw new Error(`Failed to create categories: ${categoriesError.message}`)
    }

    console.log(`✅ Created ${createdCategories.length} categories`)

    // 3. Create candidates
    console.log('👥 Creating candidates...')

    const candidatesData = []

    // King candidates
    const kingCategory = createdCategories.find(c => c.name.includes('King'))!
    kingCandidates.forEach(c => {
      candidatesData.push({ ...c, category_id: kingCategory.id })
    })

    // Queen candidates
    const queenCategory = createdCategories.find(c => c.name.includes('Queen'))!
    queenCandidates.forEach(c => {
      candidatesData.push({ ...c, category_id: queenCategory.id })
    })

    // Best Smile candidates
    const smileCategory = createdCategories.find(c => c.name.includes('Smile'))!
    smileCandidates.forEach(c => {
      candidatesData.push({ ...c, category_id: smileCategory.id })
    })

    // Most Creative candidates
    const creativeCategory = createdCategories.find(c => c.name.includes('Creative'))!
    creativeCandidates.forEach(c => {
      candidatesData.push({ ...c, category_id: creativeCategory.id })
    })

    const { data: createdCandidates, error: candidatesError } = await supabase
      .from('candidates')
      .insert(candidatesData)
      .select()

    if (candidatesError) {
      throw new Error(`Failed to create candidates: ${candidatesError.message}`)
    }

    console.log(`✅ Created ${createdCandidates.length} candidates`)

    // 4. Generate realistic votes
    console.log('🗳️  Generating votes...')

    const voters = []
    const votes = []

    // Create 50 voters with phone numbers
    for (let i = 1; i <= 50; i++) {
      voters.push({
        phone: `090${i.toString().padStart(7, '0')}`,
        event_id: EVENT_ID,
        is_verified: true
      })
    }

    const { data: createdVoters, error: votersError } = await supabase
      .from('voters')
      .insert(voters)
      .select()

    if (votersError) {
      throw new Error(`Failed to create voters: ${votersError.message}`)
    }

    console.log(`✅ Created ${createdVoters.length} voters`)

    // Generate votes with realistic distribution
    createdVoters.forEach((voter, index) => {
      // King vote (everyone votes)
      const kingCandidatesList = createdCandidates.filter(c => c.category_id === kingCategory.id)
      const kingVoteIndex = index % 3 === 0 ? 0 : index % 3 === 1 ? 1 : 2 // Top 3 get most votes
      votes.push({
        voter_id: voter.id,
        category_id: kingCategory.id,
        candidate_id: kingCandidatesList[kingVoteIndex % kingCandidatesList.length].id
      })

      // Queen vote (everyone votes)
      const queenCandidatesList = createdCandidates.filter(c => c.category_id === queenCategory.id)
      const queenVoteIndex = index % 3 === 0 ? 0 : index % 3 === 1 ? 1 : 2
      votes.push({
        voter_id: voter.id,
        category_id: queenCategory.id,
        candidate_id: queenCandidatesList[queenVoteIndex % queenCandidatesList.length].id
      })

      // Best Smile (80% vote, max 2 selections)
      if (index % 5 !== 0) {
        const smileCandidatesList = createdCandidates.filter(c => c.category_id === smileCategory.id)
        votes.push({
          voter_id: voter.id,
          category_id: smileCategory.id,
          candidate_id: smileCandidatesList[index % smileCandidatesList.length].id
        })
        // Some vote for 2
        if (index % 3 === 0) {
          votes.push({
            voter_id: voter.id,
            category_id: smileCategory.id,
            candidate_id: smileCandidatesList[(index + 1) % smileCandidatesList.length].id
          })
        }
      }

      // Most Creative (70% vote, max 2 selections)
      if (index % 3 !== 0) {
        const creativeCandidatesList = createdCandidates.filter(c => c.category_id === creativeCategory.id)
        votes.push({
          voter_id: voter.id,
          category_id: creativeCategory.id,
          candidate_id: creativeCandidatesList[index % creativeCandidatesList.length].id
        })
        // Some vote for 2
        if (index % 2 === 0) {
          votes.push({
            voter_id: voter.id,
            category_id: creativeCategory.id,
            candidate_id: creativeCandidatesList[(index + 1) % creativeCandidatesList.length].id
          })
        }
      }
    })

    const { error: votesError } = await supabase
      .from('votes')
      .insert(votes)

    if (votesError) {
      throw new Error(`Failed to create votes: ${votesError.message}`)
    }

    console.log(`✅ Created ${votes.length} votes`)

    console.log('\n🎉 Successfully seeded GLOW UP 2025 event!')
    console.log(`\n📊 Summary:`)
    console.log(`   - Categories: ${createdCategories.length}`)
    console.log(`   - Candidates: ${createdCandidates.length}`)
    console.log(`   - Voters: ${createdVoters.length}`)
    console.log(`   - Votes: ${votes.length}`)
    console.log(`\n🔗 Event ID: ${EVENT_ID}`)

  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

seedData()
