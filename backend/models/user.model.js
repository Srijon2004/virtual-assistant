// import mongoose from "mongoose";

// const userSchema=new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     email:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     password:{
//         type:String,
//         required:true
//     },
//     assistantName:{
//         type:String
//     },
//      assistantImage:{
//         type:String
//     },
//     history:[
//         {type:String}
//     ]

// },{timestamps:true})

// const User=mongoose.model("User",userSchema)
// export default User












import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Corrected from 'require'
    },
    email: {
        type: String,
        required: true, // Corrected from 'require'
        unique: true
    },
    password: {
        type: String,
        required: true, // Corrected from 'require'
    },
    assistantName: {
        type: String,
    },
    assistantImage: {
        type: String,
    },
    history: [
        { type: String }
    ]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;