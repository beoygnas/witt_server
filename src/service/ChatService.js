import ChatModel from "../model/UserModel.js";

const ChatService = {

    listchatroom : async (user_id)=> {
        const result = await ChatModel.listchatroom(user_id);
        return result;
    },

    getchatmsg : async (chat_id) => {
        const result = await ChatModel.getchatmsg(chat_id);
        return result;
    },

    sendchat : async (chat_id, msg, msg_regdata, msg_sender) => {
        const result = await ChatModel.sendchat(chat_id, msg, msg_regdata, msg_sender);
        return result;
    },

    makechatroom : async (user_id, user_nickname, chat_id, chat_name, chat_regdata) => {
        const result = await ChatModel.makechatroom(user_id, user_nickname, chat_id, chat_name, chat_regdata);
        return result;
    }
};

export default ChatService;