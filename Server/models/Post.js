import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type:String,
            required:true,
        },
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
        location:String,
        description: String,
        picturePath:String,
        userPicturePath: String,
        likes:{
            type:Map,
            of: Boolean,
        },
        comments:{
            types:Array,
            deafult:[]
        }
    },
    {timestamps:true}
);

const Post =mongoose.model("Post",PostSchema);
export default Post;