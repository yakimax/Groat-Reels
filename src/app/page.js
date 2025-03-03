"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Typography, TextField, Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import GoogleIcon from "@mui/icons-material/Google";

let url = "https://dlrehwydsvuxrpesaemj.supabase.co";
let key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscmVod3lkc3Z1eHJwZXNhZW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNzU4MzgsImV4cCI6MjA1NTk1MTgzOH0.RqykeoJ0KGhryJOgSWp3XnGhGople6oDyd3fLB8OolU";

const supabase = createClient(url, key);
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function Home() {
  let [email, setEmail] = useState("");
  let [pass, setPass] = useState("");
  const router = useRouter();

  const validateInputs = () => {
    if (!email || !pass) {
      alert("Email and password are required");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email address");
      return false;
    }
    if (pass.length < 6) {
      alert("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const Login = async () => {
    if (!validateInputs()) {
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: pass,
      });
      if (error) {
        console.error("Error:", error.message);
        alert(error.message);
        return;
      }

      if (data.user) {
        router.push("/chat?isAuth=true");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred");
    }
  };
  return (
    <div style={{ minHeight: '100vh' }}>
      <Grid
        style={{
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          margin: 0,
          width: '100%',
        }}
        container
        spacing={1.8}
      >
        <Grid size={3} sx={{ width: { xs: '95%', sm: '400px' } }}>
          <Item
            style={{
              marginTop: "10px",
              minHeight: "410px",
              backgroundColor: "black",
              border: "1px solid #353935",
              borderRadius: "0px",
              width: '100%',
            }}
          >
            <Typography
              variant="h3"
              style={{
                color: "white",
                fontWeight: "bold",
                fontFamily: "'Just Another Hand', cursive",
                marginTop: "20px",
              }}
            >
              Groat
            </Typography>
            <TextField
              InputProps={{
                style: {
                  height: "40px",
                  borderRadius: "3px",
                  border: "1px solid #353935",
                  color: "white",
                },
              }}
              id="outlined-basic"
              sx={{
                width: "80%",
                marginTop: "48px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
              }}
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username, or email"
            />
            <TextField
              type="password"
              InputProps={{
                style: {
                  height: "40px",
                  borderRadius: "3px",
                  border: "1px solid #353935",
                  color: "white",
                },
              }}
              placeholder="Password"
              id="outlined-basic"
              sx={{
                marginTop: "5px",
                width: "80%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
              }}
              variant="outlined"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <Button
              sx={{
                width: "80%",
                height: "30px",
                borderRadius: "6px",
                fontWeight: "bold",
                textTransform: "none",
                marginTop: "15px",
              }}
              variant="contained"
              onClick={Login}
            >
              Log In
            </Button>
            <Divider
              sx={{
                margin: "auto",
                color: "white",
                borderColor: "grey",
                marginTop: "20px",
                width: "80%",
                "&::before, &::after": {
                  borderColor: "#353935",
                },
                "& .MuiDivider-wrapper": {
                  color: "white",
                },
              }}
              textAlign="center"
            >
              OR
            </Divider>
            <Typography
              variant="h6"
              style={{
                color: "lightblue",
                fontSize: "15px",
                fontFamily: "sans-serif",
              }}
            >
              <GoogleIcon sx={{ fontSize: "20px", marginRight: "10px" }} />
              <a href="/signinwithgoogle">Log in with Google</a>
            </Typography>
            <a>
              <Typography
                variant="h6"
                style={{
                  color: "white",
                  fontSize: "15px",
                  fontFamily: "sans-serif",
                  marginTop: "20px",
                }}
              >
                Forgot password?
              </Typography>
            </a>
          </Item>
        </Grid>
        <Grid size={3} sx={{ width: { xs: '95%', sm: '400px' } }}>
          <Item
            style={{
              minHeight: "60px",
              backgroundColor: "black",
              border: "1px solid #353935",
              borderRadius: "0px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: '100%',
            }}
          >
            <Typography
              variant="h3"
              style={{ color: "white", fontSize: "15px" }}
            >
              Don't have an account?
              <a href="/signup" style={{ color: "lightblue" }}>
                {" "}
                Sign up
              </a>
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </div>
  );
}
