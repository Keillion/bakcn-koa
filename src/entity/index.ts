export interface Usr {
  uid: number,
  name: string,
  avatar: string,
}

export interface UsrAuth {
  uid: number,
  auth: {
    type: string,
    id: string,
    token: string,
  }[],
}
