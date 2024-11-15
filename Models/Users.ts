import mongoose from "mongoose";

const User_Schema = new mongoose.Schema({

    Username : {
        type : String,
        required : true,
        unique : true
    },

    Mail : {
        type : String,
        required : true,
        unique : true
    },

    Password : {
        type : String,
        required : true
    },

    Verified : {
        type : Boolean,
        default : false
    },

    Reset_Password_Counter : {
        type : Number,
        default : 0
    },

    Reseting_Expires_In:{
        type : Date,
        default : null
    }

} , { timestamps : true } );

export const Users = mongoose.models.Users || mongoose.model('Users',User_Schema);