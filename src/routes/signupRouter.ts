import Router from 'koa-router';
import { signup } from '@/service/usr';

const router = new Router({
  prefix: '/signup'
});

router
  .use(async(ctx, next)=>{
    console.log('before createusr')
    await next();
  })
  .post('/createusr', async ctx=>{
    console.log('createusr')
    const body = ctx.request.body;
    ctx.body = await signup(body.type, body.name, body.token);
  })
;

export default router;