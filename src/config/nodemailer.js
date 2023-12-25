import nodemailer from 'nodemailer'
import config from './config.js'

const NODEMAILER_USER = config.nodemailer_user
const NODEMAILER_PASS = config.nodemailer_pass

export const transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:NODEMAILER_USER,
        pass:NODEMAILER_PASS,

    }
})