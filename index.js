import express from "express";
import userController from "./src/controller/UserController.js";
import boardController from "./src/controller/BoardController.js";
import chatController from "./src/controller/ChatController.js";



const app = express();
//정적 파일 사용하기
app.use(express.static("public"));


const port = process.env.PORT || 3000;

app.use(
    express.json({
        limit: "50mb",
    })
);
app.use(
    express.urlencoded({
        limit: "50mb",
        extended: true,
    })
);

//router
app.use("/user", userController);
app.use("/board", boardController);
app.use("/chat", chatController);
 
app.get((req, res) => {
    res.status(404).send("not found");
});

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});