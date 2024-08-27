import dotenv from 'dotenv';
import { Hono } from 'hono';
dotenv.config()


const app = new Hono();

export const config = {
  sessionSecret: process.env.SESSION_SECRET!,

  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI!,

  linkedInClientId: process.env.LINKEDIN_CLIENT_ID!,
  linkedInClientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
  linkedInRedirectUri: process.env.LINKEDIN_REDIRECT_URI!,

  facebookClientId: process.env.FACEBOOK_CLIENT_ID!,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
  facebookCallbackUrl: process.env.FACEBOOK_CALLBACK_URL!,
};


const app_version = "v1.0";

export const appConfig ={

    port :3000,
    version : app_version

}