import mongoose from "mongoose";

const UserSchema= new mongoose.Schema(
    {
        firstName:{
            type:String,
            require:true,
            min:4,
            max:16
        },
        lastName:{
            type:String,
            require:true,
            min:4,
            max:16
        },
        email:{
            type:String,
            require:true,
            max:60,
            unique:true
        },
        password:{
            type:String,
            require:true,
            min:6
        },
        picturePath:{
            type:String,
            default:""
        },
        friends:{
            type:Array,
            default:[]
        },
        location:String,
        occupation: String,
        viewProfile:Number,
        impressions:Number


    },{timestamps:true}
)

const User= mongoose.model("User",UserSchema);
export default User;