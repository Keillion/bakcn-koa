import { createHmac, randomBytes } from 'crypto';

export function generateHmac256(info: string, salt?: string){
  if('string' !== typeof info){
    throw new TypeError('info:string get '+(typeof info));
  }
  if(salt && 'string' !== typeof salt){
    throw new TypeError('salt:string get '+(typeof salt));
  }
  if(salt){
    if(salt.length < 32){
      salt = (salt + '12345678901234567890123456789012').substring(0,32);
    }else if(salt.length > 32){
      salt = salt.substring(0,32);
    }
  }else{
    salt = randomBytes(32).toString('base64').substring(0,32);
  }

  const ret = salt + createHmac('sha256', salt).update(info).digest('base64');
  return ret;
}