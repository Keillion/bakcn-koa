import Router from 'koa-router';
import { query, mapping } from '@/db';

const router = new Router({
  prefix: '/cmd'
});

router
  .post('/ex', async ctx=>{
    if(201 !== ctx.state.user.uid){
      ctx.throw(403, "FORBIDDEN");
    }
    try{
      const res = await query(ctx.request.body);
      ctx.body = JSON.stringify(res.rows);
    }catch(ex){
      ctx.body = JSON.stringify({
        name: ex.name,
        message: ex.message,
        stack: ex.stack,
      });
    }
  })
  .post('/selectUsrAuth/:uid', async ctx=>{
    const usrAuth = await mapping.selectUsrAuth(JSON.parse(ctx.params.uid) as number);
    ctx.body = JSON.stringify(usrAuth);
  })
;

export default router;