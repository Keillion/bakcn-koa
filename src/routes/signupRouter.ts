import Router from 'koa-router';
import { mapping } from '@/db';
import { AuthUsr, Usr, UsrAuth } from '@/entity';
import { generateHmac256 } from '@/service/util';
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