import Post from "../models/Post.js";
import User from "../models/User.js";

//CREATE
export const createPost= async (req,res)=>{
    try{
        const {
            userId,
            location,description,
            picturePath
        }=req.body;
        const user=await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName:user.firstName,
            lastName: user.lastName,
            location:user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath: req.file.path,
            likes:{
                // "someid":true
            },
            comments:[]
        })
        await newPost.save();
        const post= await Post.find();
        res.status(201).json(post); //201 represents that you created something
    }
    catch(err){
        res.status(409).json({message:err.message}); //409 is error of creating it
    }
};

// READ
export const getFeedPosts = async(req,res)=>{
    try{
        const post = await Post.find();
        res.status(200).json(post); //200 represents succesful request
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const getUserPosts = async(req,res)=>{
    try{
        const {userId}= req.params;
        const post = await Post.find({userId});
        res.status(200).json(post); //200 represents succesful request
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

// UPDATE 
export const likePost = async(req,res)=>{
    try{
        const { id }=req.params;
        const {userId}= req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        if(isLiked){
            post.likes.delete(userId);
        }
        else {
            post.likes.set(userId,true);
        }
        const updatedPost = await Post.findByIdAndUpdate(
            id, {likes:post.likes}, {new:true}
        );  //await post.save()  could also been used
        
        res.status(200).json(updatedPost); //200 represents succesful request
    }catch(err){
        res.status(404).json({message:err.message});
    }
};

