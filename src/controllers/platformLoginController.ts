import { Context } from 'hono';
import { PlatformLoginService } from '../services/platfromLoginService';
import { renderFile } from 'ejs';
import path from 'path';

const platformLoginService = new PlatformLoginService();

export class PlatformLoginController {
  async homePage(c: Context) {
    try {
      const session = c.get('session');
      const user = session?.get('user');

      if (user) {
        const userInfo = {
          name: user.name,
          email: user.email,
          picture: user.picture,
          platform: user.platform,
        };
        return this.renderView(c, 'details', userInfo);
      } else {
        return this.renderView(c, 'login');
      }
    } catch (error) {
      console.error('Error in details Page:', error);
      return c.text('Internal Server Error', 500);
    }
  }

  async renderView(c: Context, view: string, data: Record<string, any> = {}) {
    const filePath = path.join(__dirname, '../view', `${view}.ejs`);
    const html = await renderFile(filePath, data);
    c.header('Content-Type', 'text/html');
    return c.html(html);
  }
  


  async googleLogin(c: Context) {
    try {
      const url = platformLoginService.getGoogleAuthUrl();
      return c.redirect(url);
    } catch (error) {
      console.error('Error in googleLogin:', error);
      return c.text('Internal Server Error', 500);
    }
  }

  async googleRedirect(c: Context) {
    try {
      const code = c.req.query('code');
      if (!code) {
        console.error('Error: Missing code in Google redirect');
        return c.text('Code parameter is missing', 400);
      }

      const profile = await platformLoginService.getGoogleUserInfo(code);
      const session = c.get('session');
      session?.set('user', { ...profile, platform: 'Google' });

      const userInfo = {
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
        platform: 'Google'
      };

      return this.renderView(c, 'details', { userInfo });
    } catch (error) {
      console.error('Error in googleRedirect:', error);
      return c.text('Internal Server Error', 500);
    }
  }

  async linkedinLogin(c: Context) {
    try {
      const url = platformLoginService.getLinkedInAuthUrl();
      return c.redirect(url);
    } catch (error) {
      console.error('Error in linkedinLogin:', error);
      return c.text('Internal Server Error', 500);
    }
  }

  async linkedinRedirect(c: Context) {
    try {
      const code = c.req.query('code');
      if (!code) {
        console.error('Error: Missing code in LinkedIn redirect');
        return c.text('Code parameter is missing', 400);
      }

      const profile = await platformLoginService.getLinkedInUserInfo(code);
      const session = c.get('session');
      session?.set('user', { ...profile, platform: 'LinkedIn' });

      const userInfo = {
        name: profile.name,
        email: profile.email,
        picture: profile.picture, 
        platform: 'LinkedIn'
      };

      return this.renderView(c, 'details', { userInfo });
    } catch (error) {
      console.error('Error in linkedinRedirect:', error);
      return c.text('Internal Server Error', 500);
    }
  }

  async facebookLogin(c: Context) {
    try {
      const state = encodeURIComponent('redirect_url=http://localhost:3000/auth/facebook/callback');
      const url = platformLoginService.getFacebookAuthUrl(state);
      return c.redirect(url);
    } catch (error) {
      console.error('Error in facebookLogin:', error);
      return c.text('Internal Server Error', 500);
    }
  }

  async facebookRedirect(c: Context) {
    try {
      const code = c.req.query('code');
      if (!code) {
        console.error('Error: Missing code in Facebook redirect');
        return c.text('Code parameter is missing', 400);
      }

      const profile = await platformLoginService.getFacebookUserInfo(code);
      const { name, email, picture } = profile;
      const session = c.get('session');
      session?.set('user', {
        name,
        email,
        picture: picture ? picture.data.url : 'Not Available', 
        platform: 'Facebook',
      });

      const userInfo = {
        name,
        email,
        picture: picture ? picture.data.url : 'Not Available',
        platform: 'Facebook'
      };

      return this.renderView(c, 'details', { userInfo });
    } catch (error) {
      console.error('Error in facebookRedirect:', error);
      return c.text('Internal Server Error', 500);
    }
  }

  async logout(c: Context) {
    try {
      const session = c.get('session');
      session?.delete();

      return this.renderView(c, 'login');
    } catch (error) {
      console.error('Error in logout:', error);
      return c.text('Internal Server Error', 500);
    }
  }
}