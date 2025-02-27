import express from "express";
import cors from "cors";
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';


dotenv.config();


let port = 8001;
let url = "https://dlrehwydsvuxrpesaemj.supabase.co"
let key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscmVod3lkc3Z1eHJwZXNhZW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNzU4MzgsImV4cCI6MjA1NTk1MTgzOH0.RqykeoJ0KGhryJOgSWp3XnGhGople6oDyd3fLB8OolU"
const app = express();
app.use(express.json());
export const supabase = createClient(url, key)
console.log(supabase);
app.use(cors({origin: 'http://localhost:3000',origin:true,credentials:true,methods:['GET','POST','PUT','DELETE','OPTIONS'],allowedHeaders:['Content-Type','Authorization']}));

app.post('/signup', async(req,res)=>{
        const { data, error } = await supabase.auth.signUp({
            email: req.body.email,
            password: req.body.password,
            options: {
                emailRedirectTo: 'http://localhost:3000/login'
            }
        })
        if(error){
            res.send(error);
        }else{
            res.send(data);
        }
})

app.listen(port,()=>{
    console.log("Listen to port ",port)
})