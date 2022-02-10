export enum AuthStates {
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  UNSET = 'UNSET',
}

export const COOKIES = {
  AUTH: {
    ACCESS_TOKEN: 'auth.access_token',
    REFRESH_TOKEN: 'auth.refresh_token',
  },
}
