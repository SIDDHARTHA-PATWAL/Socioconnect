import express from "express";
import {login} from "../Controllers/auth.js";

const router = express.Router();

router.post("/login",login);  // auth/login (autmoatically)

export default router;