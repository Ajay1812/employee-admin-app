import { Card, Typography, TextField, Button, Grid, InputAdornment, IconButton } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../config';

export function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    fetch(`${BASE_URL}/admin/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((res) => {
      res.json().then((data) => {
        console.log(data)
        localStorage.setItem("token", data.token);
        toast.success("Register successful!", { position: "top-center", autoClose: 1000 });
        setTimeout(() => navigate("/login"), 2000);
      });
    });
  };

  const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F5F5F5",
        }}
      >
        <Card
          style={{
            width: "50%",
            maxWidth: "500px",
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            overflow: "hidden",
            padding: "40px",
            animation: `${fadeIn} 0.8s ease`,
          }}
        >
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Typography variant="h4" style={{ marginBottom: "20px", fontWeight: 700 }}>
                Admin Signup
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={handleSignUp}
                fullWidth
                style={{
                  marginTop: "20px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "scale(1.02)";
                  e.target.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Sign Up
              </Button>
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center", marginTop: "10px" }}>
              <Typography variant="body2">
                Already have an account? <a href="/login">Login</a>
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </div>
      <ToastContainer />
    </>
  );
}
