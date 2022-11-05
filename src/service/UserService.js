import UserModel from "../model/UserModel.js";

const UserService = {

    signup: async (user_id, user_email, user_passwrod, user_nickname, user_gender, user_phonenumber, user_age)=> {
        const result = await UserModel.signup(user_id, user_email, user_passwrod, user_nickname, user_gender, user_phonenumber, user_age);
    
        return result;
    },

    login: async (user_email, user_password) => {
        const result = await UserModel.login(user_email, user_password);
        return result;
    },
};

export default UserService;