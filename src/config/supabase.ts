import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

console.log(process.env.SUPABASE_URL)
console.log(process.env.SUPABASE_KEY)

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)