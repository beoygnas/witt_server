import express, {Router} from "express";
import "express-promise-router";
import ChatService from "../service/UserService.js";

//정적 라우터
const router = new Router();

router.get("/", async (req, res) => {
    res.json({hello : "채팅컨트롤러입니다."});
});

router.post("/listchatroom", async (req, res) => {
    const result = await ChatService.listchatroom(
        req.body.user_id
    );
    res.send(result);
});

router.post("/getchatmsg", async(req, res) => {
    const result = await ChatService.getchatmsg(
        req.body.chat_id
    );
    res.send(result);
});

router.post("/sendchat", async(req, res) => {
    const result = await ChatService.sendchat(
        req.body.chat_id,
        req.body.msg,
        req.body.msg_regdata,
        req.body.msg_sender
    );
    res.send(result);
});

router.post("/makechatroom", async(req, res) => {
    const result = await ChatService.makechatroom(
        req.body.user_id,
        req.body.user_nickname,
        req.body.chat_id,
        req.body.chat_name,
        req.body.chat_lastchat,
        req.body.chat_regdata
    );
    res.send(result);
});

router.post("/enterchatroom", async(req, res) => {
    const result = await ChatService.enterchatroom(
        req.body.user_id,
        req.body.user_nickname,
        req.body.chat_id
    );
    res.send(result);
});

export default router;