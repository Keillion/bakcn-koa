import Router from 'koa-router';
import { mapping } from '@/db';

const router = new Router({
  prefix: '/login'
});

router
  .post('/', async ctx=>{
    const body = ctx.request.body;
    if(!body.type){}
    if(!body.type || !body.id || !body.token){ ctx.throw(500, "UserName or Password") }
    const usr = await mapping.selectUsr(JSON.parse(ctx.params.uid) as number);
    ctx.body = JSON.stringify(usr);
  })
;

export default router;