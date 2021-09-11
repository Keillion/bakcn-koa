import Router from 'koa-router';
import { signup } from '@/service/usr';

const router = new Router({
  prefix: '/signup'
});

router
  .post('/createusr', async ctx=>{
    const body = ctx.body;
    ctx.body = await signup(body.type, body.name, body.token);
  })
;

export default router;