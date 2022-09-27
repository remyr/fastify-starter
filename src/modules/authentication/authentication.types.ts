export enum ProviderTypes {
  Local = 'local',
  Google = 'google',
}

export interface DecodedToken {
  user: { id: string; email: string };
  iat: number;
  exp: number;
}
