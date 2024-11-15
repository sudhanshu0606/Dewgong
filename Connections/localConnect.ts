import mongoose from "mongoose";

const URI = process.env.MONGO_DB_URI || "mongodb://localhost:27017"
const dbName = process.env.MONGO_DB || "BoraBora"

async function Connect(){

    try {

        await mongoose.connect( URI , { dbName : dbName } );

    } catch (error) {

        console.log("Err Connecting to Database");

    }
    
}

export default Connect;