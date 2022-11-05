import { query } from "./database/db.js";
import { spawn } from "child_process";

let ChatModel = {

    enterchatroom : async(user_id, user_nickname, chat_id)=>{
        try{

            return{
                message : "success"
            }
        }catch(err){
            console.log(err);
            return {
                message: "fail"
            };
        }
    },
    makechatroom : async(user_id, user_nickname, chat_id, chat_name, chat_regdata) => {
        try{
            await query(`insert into chatroom_list values(default, $1, null, $2)`, [chat_name, chat_regdata]);

            chat_id = await (await query(`select chat_id from chatroom_list where chat_name = $1`, [chat_name]));
            chat_id = chat_id.rows[0].chat_id;

            await query(`insert into chatroom_user values($1, $2, $3)`, [chat_id, user_nickname, user_id]);
            await sendchat(user_nickname, chat_id, `안녕하세요. ${chat_name}방입니다.`, chat_regdata);

            return{
                message : "success"
            }
        }catch(err){
            console.log(err);
            return {
                message: "fail"
            };
        }
    },
    sendchat : async(chat_id, msg, msg_regdata, msg_sender) => {
        try{
            await query(`insert into chatroom_msg values($1, default, $2, $3, $4)`, [chat_id, msg, msg_regdata, msg_sender]);

            await query(`update chatroom_list set chat_lastchat=$2 and chat_regdata=$3 where chat_id=$1;`, [chat_id, msg, msg_regdata]);

            return{
                message : "success"
            }
        }catch(err){
            console.log(err);
            return {
                message: "fail"
            };
        }

    },
    listchatroom : async(user_id) => {
        try {
            const result = await query(`select chat_id, chat_name, chat_lastchat, chat_regdata from chatroom_user inner join chatroom_list using (chat_id) where email = $1 order by regdata desc `, [user_id]);
            return {
                message: "success"
            };
        }catch (err){
            console.log(err);
            return {
                message: "fail",
            };
        }
    },
    signup : async (user_id, user_email, user_password, user_nickname, user_gender, user_phonenumber, user_age) => {
        try {
            await query(
                `insert into users(user_id, user_email, user_password, user_nickname, user_gender, user_phonenumber, user_age) values(default, $1,$2,$3,$4,$5,$6)`,
                [user_email, user_password, user_nickname, user_gender, user_phonenumber, user_age]
            );

            const crawlresult = spawn('python3', ['./users.crawl.py', user_nickname]);
            const result = await UserModel.crawl(crawlresult);
            result.unshift(user_nickname)
            result.unshift(user_email)
            
            await query(
                `insert into users_lolinfo(user_email, lol_nickname, lol_level, lol_tier, lol_most1, lol_most2, lol_most3) values($1,$2,$3,$4,$5,$6,$7)`,
                result
            );

            return {
                message: "success",
            };

        } catch (err) {
            console.log(err);
            return {
                message: "fail",
            };
        }
    },

    login : async (user_email, user_password) => {
        try {
            const result = await query(
                `select * from users where user_email=$1 and user_password=$2`, [user_email, user_password]);

            if(result.rows.length == 1){
                return {
                    message: "success"
                };
            }
            else{
                return{
                    messsage : "아이디가 없습니다. 회원가입부터!"
                }
            };
        } catch (err) {
            return {
                message: "error!",
            };
        }
    },
};

export default ChatModel;

