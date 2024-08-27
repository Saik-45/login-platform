import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import {appConfig} from './config/app';
import { logger } from 'hono/logger'
import { cors } from 'hono/cors';
import {platformLoginRoutes} from './routes/platformLoginRoutes';

const app = new Hono()

app.use(logger())

app.use("*", cors());

app.route('/', platformLoginRoutes);

app.get('/', async (c) => {
  return c.text('this is my project index...')
})


const port = appConfig.port;

serve({
  fetch: app.fetch,
  port
})

console.log(`Server is running on port ${port}`)
