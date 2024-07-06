import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname} from "path";
import path from "path";
import helmet, { crossOriginResourcePolicy } from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./Controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./Controllers/posts.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import {users ,posts} from "./data/index.js"


// CONFIGURATIONS
const app =express();
// const port =3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config()
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Use core middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({limit:"30mb", extended: true }));
// app.use("/assets",express.static(path.join(__dirname+"public/assets")));
// app.use(morgan("tiny"));
// app.use(helmet());
// app.use(cors());

// app.use((req, res, next) => {
//   const clientIP = req.ip || req.connection.remoteAddress;
//   console.log(`Request from IP: ${clientIP}`);
//   next();
// });


// STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/assets') // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // File name
    }
  });
const upload = multer({ storage: storage });

// ROUTES WITH FILES
app.post("/auth/register",upload.single("picture"),register);
app.post("/posts",verifyToken,upload.single("picture"),createPost);

// ROUTES
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("posts",postRoutes);

app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/index.html");
});



//   Mongoose setup
const PORT= process.env.port ||6001;
mongoose.connect(process.env.mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    app.listen(PORT,()=> console.log(`Sever running on Port ${PORT}`));

    // ADD DATA ONE TIME ONLY
    // User.insertMany(users);
    // Post.insertMany(posts);
})
.catch((error)=>console.log(`${error} did not connect`));
