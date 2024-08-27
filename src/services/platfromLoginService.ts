import axios from 'axios';
import { config } from '../config/app';

const GOOGLE_CLIENT_ID = config.googleClientId;
const GOOGLE_CLIENT_SECRET = config.googleClientSecret;
const GOOGLE_REDIRECT_URI = config.googleRedirectUri;

const LINKEDIN_CLIENT_ID = config.linkedInClientId;
const LINKEDIN_CLIENT_SECRET = config.linkedInClientSecret;
const LINKEDIN_REDIRECT_URI = config.linkedInRedirectUri;

const FACEBOOK_CLIENT_ID = config.facebookClientId;
const FACEBOOK_CLIENT_SECRET = config.facebookClientSecret;
const FACEBOOK_CALLBACK_URL = config.facebookCallbackUrl;

export class PlatformLoginService {
  
  public getGoogleAuthUrl(): string {
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`;
  }

  public async getGoogleUserInfo(code: string): Promise<any> {
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token } = data;
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return profile;
  }

  public getLinkedInAuthUrl(): string {
    return `https://www.linkedin.com/oauth/v2/authorization?client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${LINKEDIN_REDIRECT_URI}&response_type=code&scope=profile%20openid%20email`;
  }

  public async getLinkedInUserInfo(code: string): Promise<any> {
    const { data: tokenData } = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', {
      redirect_uri: LINKEDIN_REDIRECT_URI,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token } = tokenData;

    const { data: profileData } = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const userDetails = {
      name: profileData.name,
      picture: profileData.picture,
      email: profileData.email,
    };

    return userDetails;
  }

  public getFacebookAuthUrl(state: string): string {
    return `https://www.facebook.com/v10.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${FACEBOOK_CALLBACK_URL}&state=${state}&scope=email,public_profile`;
  }

  public async getFacebookUserInfo(code: string): Promise<any> {
    const { data: tokenData } = await axios.get('https://graph.facebook.com/v10.0/oauth/access_token', {
      params: {
        client_id: FACEBOOK_CLIENT_ID,
        client_secret: FACEBOOK_CLIENT_SECRET,
        redirect_uri: FACEBOOK_CALLBACK_URL,
        code,
      },
    });

    const { access_token } = tokenData;

    if (!access_token) {
      throw new Error('Failed to obtain access token from Facebook');
    }

    const { data: profile } = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'name,email,picture',
        access_token,
      },
    });

    return profile;
  }
}
