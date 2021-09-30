import { Pool, types } from 'pg';
import { Usr, UsrAuth, AuthUsr, Connection } from '@/entity';

// https://github.com/brianc/node-pg-types
// Number.MAX_SAFE_INTEGER == 9007199254740991
types.setTypeParser(20, v=>JSON.parse(v));

// code modified from https://node-postgres.com/guides/project-structure

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: JSON.parse(process.env.DB_PORT),
});

const query = async(text:string, params?:any[])=>{
  console.log('execute query', { text, params });
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};

const getClient = async()=>{
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;
  // set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    console.error(`The last executed query on this client was: ${(client as any).lastQuery}`);
  }, 5000);
  // monkey patch the query method to keep track of the last query executed
  client.query = (...args:any[]) => {
    (client as any).lastQuery = args;
    return query.apply(client, args);
  };
  client.release = () => {
    // clear our timeout
    clearTimeout(timeout);
    // set the methods back to their old un-monkey-patched version
    client.query = query;
    client.release = release;
    return release.apply(client);
  };
  return client;
};

const mapping = {
  insertUsr: async(usr: Usr)=>{
    const res = usr.uid ?
      await query(`insert into usr(uid,name,avatar) values ($1,$2,$3) returning uid;`,[usr.uid,usr.name,usr.avatar]) :
      await query(`insert into usr(name,avatar) values ($1,$2) returning uid;`,[usr.name,usr.avatar]);
    //return JSON.parse(res.rows[0].uid) as number;
    return res.rows[0].uid as number;
  },
  selectUsr: async(uid: number):Promise<Usr>=>{
    const res = await query(`select * from usr where uid=$1;`,[uid]);
    // if(res.rowCount){
    //   const usr = res.rows[0];
    //   usr.uid = JSON.parse(usr.uid);
    //   return usr as Usr;
    // }else{
    //   return null;
    // }
    return res.rows[0] as Usr;
  },
  insertUsrAuth: async(v: UsrAuth)=>{
    const res = await query(`insert into usrauth(uid,auth) values ($1,$2);`,[v.uid,JSON.stringify(v.auth)]);
    return res.rowCount;
  },
  selectUsrAuth: async(uid: number)=>{
    const res = await query(`select * from usrauth where uid=$1;`,[uid]);
    // if(res.rowCount){
    //   const usrAuth = res.rows[0];
    //   usrAuth.uid = JSON.parse(usrAuth.uid);
    //   return usrAuth as UsrAuth;
    // }else{
    //   return null;
    // }
    return res.rows[0] as UsrAuth;
  },
  insertAuthUsr: async(v: AuthUsr)=>{
    const res = await query(`insert into authusr(type,identifier,token,uid) values ($1,$2,$3,$4);`,[v.type,v.identifier,v.token,v.uid]);
    return res.rowCount;
  },
  selectAuthUsr: async(type: string, identifier: string)=>{
    const res = await query(`select * from authusr where type=$1 and identifier=$2;`,[type,identifier]);
    return res.rows[0] as AuthUsr;
  },
  insertConnection: async(v: Connection)=>{
    const res = await query(
      `insert into connection(uid,token,used,qty,"adQty","ovQty",spd,"cycleDays","nextCycleDate","expireDate","nextConnection",status,comment) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13);`,
      [v.uid,v.token,v.used,v.qty,v.adQty,v.ovQty,v.spd,v.cycleDays,v.nextCycleDate,v.expireDate,v.nextConnection,v.status,v.comment]
    );
    return res.rowCount;
  },
  selectConnection: async(uid: number)=>{
    const res = await query(`select * from connection where uid=$1;`,[uid]);
    return res.rows[0] as Connection;
  },
};

export { query, getClient, mapping };
