import mongoose from "mongoose"
import envConfig from "./dotenv.js";

const db = async (req,res)=>{
    try {
       await mongoose.connect(process.env.MONGODB_URL);
       console.log("DataBase Connected");
       
    } catch (error) {
        console.log(error.message);
        
        console.log("dataBase is not Connected");

    }
}

export default db;