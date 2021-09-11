
import { mapping } from '@/db';
import { ExposableError, AuthUsr, Usr, UsrAuth } from '@/entity';
import jwt from 'jsonwebtoken';
import { generateHmac256 } from '@/service/util';

export async function signup(type: string, name: string, token: string){
  let uid;
  if('usrpwd' === type){
    if('string' !== typeof name || 0 === name.length){
      throw new ExposableError("Name can't be empty.");
    }
    if('string' !== typeof token || token.length < 6 || token.length > 64){
      throw new ExposableError("The length of password should between 6 to 64.");
    }
    token = generateHmac256(token);

    // TODO: be a transaction?
    const usr: Usr = {
      uid: undefined,
      name: name,
      avatar: undefined,
    };
    uid = await mapping.insertUsr(usr);

    const authusr: AuthUsr = {
      type: 'usrpwd',
      identifier: JSON.stringify(uid), // temp, user can change
      token,
      uid,
    };
    const usrauth: UsrAuth = {
      uid,
      auth: [{
        type: 'usrpwd',
        identifier: JSON.stringify(uid), // temp, user can change
      }],
    };
    await Promise.all([mapping.insertAuthUsr(authusr),mapping.insertUsrAuth(usrauth)]); // todo: how about failed

  }else{
    throw new Error('Not implement.');
  }
  return jwtSign(uid);
}

const jwtSign = (uid:number) => {
  return jwt.sign({
    uid,
    exp: Math.floor(Date.now() / 1000) + 7 * 3600
  },process.env.JWT_SECRET);
};

export async function login(type: string, identifier: string, token: string){
  let uid: number = null;
  if('usrpwd' === type){
    uid = await loginFromUsrPwd(identifier, token);
  }else if('weixin' === type){
    throw new Error("Not implement.");
  }else{
    throw new Error("Unknown login type.");
  }
  return jwtSign(uid);
}

const loginFromUsrPwd = async(usrName: string, password: string)=>{
  if(!usrName || !password){
    throw new ExposableError("UserName or Password not right.");
  }
  const authUsr = await mapping.selectAuthUsr("usrpwd",usrName);
  if(generateHmac256(password, authUsr.token) !== authUsr.token){
    throw new ExposableError("UserName or Password not right.");
  }
  return authUsr.uid;
};