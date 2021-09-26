import dotenv from 'dotenv';
dotenv.config();
import 'module-alias/register';

import Koa from "koa";
import koaBody from 'koa-body';
import jwt from 'koa-jwt';
import cors from '@koa/cors';

import usrRouter from '@/routes/usrRouter';
import loginRouter from '@/routes/loginRouter';
import signupRouter from '@/routes/signupRouter';
import cmdRouter from '@/routes/cmdRouter';

const app = new Koa();

if(process.env.BAKCN_DEBUG){
  app.use(cors());
}

app
  // set Authorization: 'Bearer jwt-token'
  .use(jwt({ secret: process.env.JWT_SECRET, passthrough: true }))
  .use(koaBody())
  .use(async(ctx, next)=>{
    console.log("ctx.state.user",ctx.state.user);
    console.log(`${ctx.method} ${ctx.url}`);
    try{
      await next();
    }catch(ex){
      console.log(ex);
      throw ex;
    }
  })
  .use(usrRouter.routes())
  // fetch('login',{method:"POST",headers:{'Content-Type':"application/json"},body:JSON.stringify({type:'usrpwd',identifier:'xxx',token:'***'})})
  .use(loginRouter.routes())
  .use(async(ctx, next)=>{
    console.log('before signupRouter')
    await next();
  })
  .use(signupRouter.routes())
  .use(cmdRouter.routes())
;

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.listen(18080);

