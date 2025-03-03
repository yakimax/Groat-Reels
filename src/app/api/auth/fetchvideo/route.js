import { NextResponse, NextRequest } from "next/server";
import { createClient } from '@supabase/supabase-js'

const url = "https://dlrehwydsvuxrpesaemj.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscmVod3lkc3Z1eHJwZXNhZW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNzU4MzgsImV4cCI6MjA1NTk1MTgzOH0.RqykeoJ0KGhryJOgSWp3XnGhGople6oDyd3fLB8OolU"
const supabase = createClient(url, key)


export async function GET(request,response) {
    try {
        const { data, error } = await supabase.storage.from('Reels').list('Public');
        if (error) {
            console.error('Error fetching video:', error.message);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
}