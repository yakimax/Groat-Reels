import { createClient } from '@supabase/supabase-js'
import { NextResponse, NextRequest } from 'next/server'

const url = "https://dlrehwydsvuxrpesaemj.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscmVod3lkc3Z1eHJwZXNhZW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNzU4MzgsImV4cCI6MjA1NTk1MTgzOH0.RqykeoJ0KGhryJOgSWp3XnGhGople6oDyd3fLB8OolU"
const supabase = createClient(url, key)

export async function POST(request, response) {
    try {
        const data = await request.json();
        const filesWithUrls = data.map(file => {
            const { data: { publicUrl } } = supabase.storage
              .from('Reels')
              .getPublicUrl(`Public/${file.name}`);
            return { ...file, publicUrl };
        });
        if(filesWithUrls.length === 0){
            return NextResponse.json({ error: 'No files found in bucket' }, { status: 400 });
        }
          
        return NextResponse.json({ filesWithUrls });
    } catch(error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
