const mongoose=require('mongoose');

const connectDB=async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb connected successfully");
        
    } catch (error) {
        console.error("mongo db conection fail",error.message);
        process.exit(1)
        
    }
}


module.exports=connectDB;