import dotenv from 'dotenv';

dotenv.config();
export default {
    port : process.env.PORT,
    persistence : process.env.PERSISTENCE,
    mongo_uri : process.env.MONGO_URI,
    secret_jwt : process.env.SECRET_KEY_JWT,
    git_client_id : process.env.GITHUB_CLIENT_ID,
    git_client_secret  : process.env.GITHUB_CLIENT_SECRET,
    secret_session  : process.env.SECRET_SESSION,
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    nodemailer_user: process.env.NODEMAILER_USER,
    nodemailer_pass: process.env.NODEMAILER_PASS,

}
