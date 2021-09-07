import Router from 'koa-router';
import { query } from '../db';

const router = new Router({
  prefix: '/cmd'
});

router
  .post('/ex', async ctx=>{
    try{
      const res = await query(ctx.request.body);
      ctx.body = JSON.stringify(res.rows);
    }catch(ex){
      console.error(ex);
    }
  })
;

export default router;