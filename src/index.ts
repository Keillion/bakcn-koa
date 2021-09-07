import dotenv from 'dotenv';
dotenv.config();
import 'module-alias/register';

import Koa from "koa";
import koaBody from 'koa-body';

import usrRouter from './routes/usrRouter';
import cmdRouter from './routes/cmdRouter';

const app = new Koa();

app
  .use(koaBody())
  .use(usrRouter.routes())
  .use(usrRouter.allowedMethods())
  .use(cmdRouter.routes())
;

app.listen(8080);

