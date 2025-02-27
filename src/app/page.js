'use client'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { InputAdornment } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';


let url = "https://dlrehwydsvuxrpesaemj.supabase.co"
let key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscmVod3lkc3Z1eHJwZXNhZW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNzU4MzgsImV4cCI6MjA1NTk1MTgzOH0.RqykeoJ0KGhryJOgSWp3XnGhGople6oDyd3fLB8OolU"

const supabase = createClient(url,key);




export default function Home() {
  let [email,setEmail] = useState("");
  let [pass,setPass] = useState("");
  let [isAuth,setIsAuth] = useState(false);
  console.log(email,pass)
  const router = useRouter();

  const validateInputs = () => {
    if (!email || !pass) {
      alert("Email and password are required");
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      alert("Please enter a valid email address");
      return false;
    }
    if (pass.length < 6) {
      alert("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const signUp = async () => {
    if (!validateInputs()) {
      return;
    }
    const data = await fetch("/api/auth/signup",
      {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({email:email,password:pass})
      })
      const res = await data.json();
      console.log(res);
      if(res.user.aud=="authenticated"){
        router.push("/chat?isAuth=true");
      }else{
        alert("Invalid Credentials");
      }
  }
  const Login = async () => {
    if (!validateInputs()) {
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: pass
      });
      if (error) {
        console.error('Error:', error.message);
        alert(error.message);
        return;
      }

      if (data.user) {
        router.push("/chat?isAuth=true");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert("An unexpected error occurred");
    }
  }
  return (
  <div className='Main-container' >
    <Paper  sx={{borderRadius:"1rem",backgroundColor:"#A1D6E2",width:"30vw",height:"45vh",display:"flex",justifyContent:"center",padding:"4rem"}} elevation={3} >
    <div className="Signup-container">
      <TextField 
        onChange={(e)=>setEmail(e.target.value)}
        sx={{
          input:{color :"black"},
          '& .MuiOutlinedInput-root': {
            borderRadius: '1rem'
        }}}
      label="Email" color="secondary" focused />
      <TextField 
        onChange={(e)=>setPass(e.target.value)}
        sx={{
          input:{color :"black"},
          '& .MuiOutlinedInput-root': {
            borderRadius: '1rem'
        }}}
        label="Password" 
        color="secondary" 
        focused
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <VisibilityOff sx={{ color: 'white' }} />
            </InputAdornment>
          ),
        }}
      />
      <Button 
        variant="outlined"
        sx={{height:"8vh",width:"20vw"}} 
        onClick={signUp}  
        color="secondary"
      >
        Sign Up
      </Button>
      
      <Button 
       variant="outlined"
        sx={{height:"8vh"}} 
        onClick={Login}  
        color="secondary"
      >
        Log in
      </Button>
    </div>
    </Paper>
  </div>
  );
}