import dotenv from 'dotenv';
dotenv.config();
import 'module-alias/register';

import Koa from "koa";
import koaBody from 'koa-body';
import jwt from 'koa-jwt';

import usrRouter from '@/routes/usrRouter';
import loginRouter from '@/routes/loginRouter';
import signupRouter from '@/routes/signupRouter';
import cmdRouter from '@/routes/cmdRouter';

const app = new Koa();

app
  // set Authorization: 'Bearer jwt-token'
  .use(jwt({ secret: process.env.JWT_SECRET, passthrough: true }))
  .use(async(ctx, next)=>{
    console.log(ctx.state.user);
    await next();
  })
  .use(koaBody())
  .use(usrRouter.routes())
  // fetch('login',{method:"POST",headers:{'Content-Type':"application/json"},body:JSON.stringify({type:'usrpwd',identifier:'xxx',token:'***'})})
  .use(loginRouter.routes())
  .use(signupRouter.routes())
  .use(cmdRouter.routes())
;

app.listen(8080);

