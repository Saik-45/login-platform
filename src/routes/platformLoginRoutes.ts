import { Hono } from 'hono';
import { PlatformLoginController } from '../controllers/platformLoginController';

const route = new Hono();
const platformLoginController = new PlatformLoginController();

route.get('/auth/google', async (c) => await platformLoginController.googleLogin(c));
route.get('/google/redirect', async (c) => await platformLoginController.googleRedirect(c));

route.get('/auth/linkedin', async (c) => await platformLoginController.linkedinLogin(c));
route.get('/linkedin/redirect', async (c) => await platformLoginController.linkedinRedirect(c));

route.get('/auth/facebook', async (c) => await platformLoginController.facebookLogin(c));
route.get('/auth/facebook/callback', async (c) => await platformLoginController.facebookRedirect(c));

route.get('/', async (c) => await platformLoginController.homePage(c));
route.get('/logout', async (c) => await platformLoginController.logout(c));

export const platformLoginRoutes = route;
