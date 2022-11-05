import { query } from "./database/db.js";
import { spawn } from "child_process";

let UserModel = {

    crawl : (crawlresult) => {
        return new Promise((resolve) => {
            crawlresult.stdout.on('data', async (data) => {
                const resultstr =  data.toString();
                const resultarr = [];
                
                let pv = 0;
                let chk = false;
    
                for(let i=0 ; i < resultstr.length ; i++){
                    if (resultstr[i] == '\''){
                        if(chk){
                            chk = false;
                            resultarr.push(resultstr.slice(pv, i));
                            console.log(resultstr.slice(pv, i));
                        }
                        else {
                            chk = true;
                            pv = i+1;
                        }
                    }
                }            
                resolve(resultarr);
            });
        });
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

            console.log(result.rows[0].user_id);
            if(result.rows.length == 1){
                return {
                    message: "success",
                    result : result.rows
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

export default UserModel;

