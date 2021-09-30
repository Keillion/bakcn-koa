

export class ExposableError extends Error {
}

export interface Usr {
  uid: number,
  name: string,
  avatar: string,
}
// export function convertPgUsr(usr:any){
//   usr.uid = JSON.parse(usr.uid);
//   return usr as Usr;
// };

export interface UsrAuth {
  uid: number,
  auth: {
    type: string,
    identifier: string,
  }[],
}
// export function convertPgUsrAuth(usrAuth:any){
//   usrAuth.uid = JSON.parse(usrAuth.uid);
//   return usrAuth as UsrAuth;
// };

export interface AuthUsr {
  type: string,
  identifier: string,
  token: string,
  uid: number,
}
// export function convertPgAuthUsr(authUsr:any){
//   authUsr.uid = JSON.parse(authUsr.uid);
//   return usrAuth as UsrAuth;
// };

export interface Connection {
  uid: string,
  token: string,
  used: number,
  qty: number,
  adQty: number,
  ovQty: number,
  spd: number,
  cycleDays: number,
  nextCycleDate: string,
  expireDate: string,
  nextConnection: {
    template?: string,
    qty: number,
    spd: number,
    cycleDays: number,
    expireDate: string,
    comment: string,
  }[],
  status: number,
  comment: string,
}
