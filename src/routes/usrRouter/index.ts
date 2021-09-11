import Router from 'koa-router';
import { mapping } from '@/db';
import connectionRouter from './connectionRouter';

const router = new Router({
  prefix: '/usr/:uid'
});

router
  .get('/', async ctx=>{
    const usr = await mapping.selectUsr(JSON.parse(ctx.params.uid) as number);
    ctx.body = JSON.stringify(usr);
  })
  .use(connectionRouter.routes())
;

export default router;