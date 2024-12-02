import mongoose from "mongoose";

type ConnectionObject={
    isConnected?: number
}

const connection: ConnectionObject={}

async function dbConnect(): Promise<void>{
    if(connection?.isConnected){
        console.log("DB is Already Connected")
        return
    }

    try {
      const db = await mongoose.connect(process.env.MONGODB_URI || '');

     // console.log("🚀 ~ dbConnect ~ db:", db)

      connection.isConnected=db.connections[0].readyState;

      console.log("DB Connected Successfully")
    } catch (error) {
        console.log("Unable To Connect To Database",error);
        process.exit(1)
        
    }
}

export default dbConnect