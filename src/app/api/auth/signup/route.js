import { createClient } from '@supabase/supabase-js'

const url = "https://dlrehwydsvuxrpesaemj.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscmVod3lkc3Z1eHJwZXNhZW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNzU4MzgsImV4cCI6MjA1NTk1MTgzOH0.RqykeoJ0KGhryJOgSWp3XnGhGople6oDyd3fLB8OolU"
const supabase = createClient(url, key)

export async function POST(request) {
    try {
        const { email, password } = await request.json()
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: 'http://localhost:3000/Chat?isAuth=true'
            }
        })

        if (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }

        return Response.json(data)
    } catch (error) {
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}