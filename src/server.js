import  express  from "express";
import bodyParser from "body-parser";
import viewEngine from"./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from './config/connectDB'
import cors from 'cors'
import db from "./models/index";
import chatboxServices from './Services/chatboxServices'
const axios = require('axios');
// const express = require("express");
const passport = require("passport");
const session = require("express-session");
// const cookieSession = require("cookie-session");
require("./auth");

require('dotenv').config();


let app = express();
// Cho phép tất cả các nguồn
// const PORT = 3000;
app.use(cors({ credentials: true, origin: true}));
// app.use(cors({ credentials: true, origin: true }));

app.use(express.json());

// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });



//config app
app.use(bodyParser.json({limit:"500mb"}));
app.use(bodyParser.urlencoded({ extended: true}))

viewEngine(app);
initWebRoutes(app);

connectDB();


let port = process.env.PORT || 6969;
//nếu chưa gán port ở file env thì gán bằng 6969

// app.listen(port, ()=>{
//     //callback
//     console.log("Backend Nodejs is running on the port : "+port )
// })


//tích hợp google
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // hoặc dùng axios

// const app = express();
app.use(cors());
app.use(bodyParser.json());

const GOOGLE_CLIENT_ID = "1041720831778-tq3kabrbmufo882tb21m7cr0oi14bi24.apps.googleusercontent.com";

// Hàm xác thực thủ công ID token bằng Google API
async function verifyGoogleToken(token) {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
  const data = await response.json();

  if (data.aud !== GOOGLE_CLIENT_ID) {
    throw new Error("Token không hợp lệ (aud)");
  }
  
  return {
    email: data.email,
    name: data.name,
    picture: data.picture,
  };
}

// Route xử lý đăng nhập bằng google
app.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;

  try {
    const userData = await verifyGoogleToken(token);
    const extraUserInfo = await getUserExtraInfo(token);

    // Có thể lưu vào DB ở đây nếu cần

    res.status(200).json({
      message: "Đăng nhập thành công",
      user: userData,
      extraUserInfo: extraUserInfo
    });
  } catch (error) {
    console.error("Xác thực thất bại:", error);
    res.status(401).json({ error: "Token không hợp lệ" });
  }
});


// Exchange code for access_token


async function getAccessToken(code) {
  const res = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: "1041720831778-tq3kabrbmufo882tb21m7cr0oi14bi24.apps.googleusercontent.com",
    client_secret: "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",
    redirect_uri: "http://localhost:3000/auth/google/callback",
    grant_type: "authorization_code"
  });

  return res.data.access_token;
}


async function getUserExtraInfo(access_token) {
  const res = await axios.get("https://people.googleapis.com/v1/people/me?personFields=genders,birthdays", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return res.data;
}

//Chat box

import http from 'http';
import { Server } from 'socket.io';


const allowedOrigins = [
  'http://localhost:3000',
  'https://schedule-frontend-five.vercel.app'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('✅ Socket.IO client connected:', socket.id);

  socket.on('join_room', (chatRoomId) => {
    socket.join(`room_${chatRoomId}`);
    console.log(`Client joined room_${chatRoomId}`);
  });

  socket.on('send_message', (data) => {
    console.log('send_message: ',data)
    console.log('Message received:', data.message);
    io.to(`room_${data.chat_room_id}`).emit('new_message', data);
  });



  socket.on('disconnect', () => {
    console.log('🚪 Client disconnected');
  });
});


app.use(cors({
  origin: '*',
}));
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

// app.listen(5000, () => console.log("Server đang chạy tại http://localhost:5000"));
