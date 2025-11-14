import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkEvents() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log('Events in database:')
  console.log(JSON.stringify(events, null, 2))
}

checkEvents()
