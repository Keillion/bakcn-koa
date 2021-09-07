import { Pool } from 'pg';
import { Usr, UsrAuth } from '@/entity';

// code modified from https://node-postgres.com/guides/project-structure

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: JSON.parse(process.env.DB_PORT),
});

const query = async(text:string, params?:any[])=>{
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
    const res = await query(`insert into usr(name,avatar) values ($1,$2);`,[usr.name,usr.avatar]);
    return res.rowCount;
  },
  selectUsr: async(uid: number)=>{
    const res = await query(`select * from usr where uid=$1;`,[uid]);
    return res.rows[0] as Usr;
  },
};

export { query, getClient, mapping };
