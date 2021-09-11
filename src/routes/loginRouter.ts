import Router from 'koa-router';
import { login } from '@/service/login'

const router = new Router({
  prefix: '/login'
});

router
  .post('/', async ctx=>{
    const body = ctx.request.body;
    ctx.body = await login(body.type, body.identifier, body.token);
  })
;

export default router;