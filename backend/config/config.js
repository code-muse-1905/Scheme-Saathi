import dotenv from 'dotenv';
dotenv.config();

if(!process.env.MONGO_URI){
    console.log("Error on mongo uri");
}

if(!process.env.CLOUDINARY_CLOUD_NAME){
    console.log("Error on CLOUDINARY_CLOUD_NAME");
}

if(!process.env.CLOUDINARY_API_KEY){
    console.log("Error on CLOUDINARY_API_KEY");
}

if(!process.env.CLOUDINARY_API_SECRET){
    console.log("Error on CLOUDINARY_API_SECRET");
}
if(!process.env.GEMINI_API_KEY){
    console.log("Error on GEMINI_API_KEY");
}
if(!process.env.BREVO_API_KEY){
    console.log("Error on BREVO_API_KEY");
}

if(!process.env.BREVO_SENDER_EMAIL){
    console.log("Error on BREVO_SENDER_EMAIL");
}
const config = {
    MONGO_URI : process.env.MONGO_URI,
    CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    BREVO_API_KEY : process.env.BREVO_API_KEY,
    BREVO_SENDER_EMAIL : process.env.BREVO_SENDER_EMAIL
}
export default config;