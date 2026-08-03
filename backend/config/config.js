import dotenv from 'dotenv';
dotenv.config();

if(!process.env.MONGO_URI){
    console.log("Error on mongo uri");
}
const config = {
    MONGO_URI : process.env.MONGO_URI,
}
export default config;