import express, { Router } from "express";
import "express-promise-router";
import UserService from "../service/UserService.js";

//정적 라우터
const router = new Router();

router.get("/", async (req, res) => {
    res.json({hello : "유저컨트롤러입니다."});
});

router.post("/signup", async (req, res) => {
    const result = await UserService.signup(
        req.body.user_id, 
        req.body.user_email, 
        req.body.user_password,
        req.body.user_nickname, 
        req.body.user_gender, 
        req.body.user_phonenumber, 
        req.body.user_age
    );
    res.send(result);
});

router.post("/login", async (req, res) => {
    const result = await UserService.login(
        req.body.user_email, 
        req.body.user_password
    );
    console.log(result);
    res.send(result);
});


export default router;