import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const voter_id = 'ad7a4296-5d2e-4fcf-b1ab-2bf5077e42a0'

async function testDeletion() {
  console.log('Testing vote deletion with service role...\n')

  // First check existing votes
  const { data: before } = await supabase
    .from('votes')
    .select('id')
    .eq('voter_id', voter_id)

  console.log('Votes before deletion:', before?.length || 0)

  // Try to delete
  const { data, error } = await supabase
    .from('votes')
    .delete()
    .eq('voter_id', voter_id)
    .select()

  if (error) {
    console.error('❌ Delete error:', error)
  } else {
    console.log('✅ Deletion successful!')
    console.log('Deleted votes:', data?.length || 0)
  }

  // Check again
  const { data: after } = await supabase
    .from('votes')
    .select('id')
    .eq('voter_id', voter_id)

  console.log('Votes after deletion:', after?.length || 0)
}

testDeletion()
