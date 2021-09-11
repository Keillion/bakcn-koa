import Router from 'koa-router';
import { mapping } from '@/db';

const router = new Router({
  prefix: '/usr/:uid'
});

router
  .get('/', async ctx=>{
    const usr = await mapping.selectUsr(JSON.parse(ctx.params.uid) as number);
    ctx.body = JSON.stringify(usr);
  })
;

export default router;