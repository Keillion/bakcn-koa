import Router from 'koa-router';
import { login } from '@/service/usr';
import { mapping } from '@/db';
import { ExposableError } from '@/entity';

const router = new Router({
  prefix: '/connection'
});

router
  .use(async ctx=>{
    if(ctx.state.user.uid as number !== JSON.parse(ctx.params.uid) as number){
      ctx.throw(403, "FORBIDDEN");
    }
  })
  .get('/', async ctx=>{
    const uid = JSON.parse(ctx.params.uid) as number;
    const connection = await mapping.selectConnection(uid);
    ctx.body = JSON.stringify(connection);
  })
;

export default router;