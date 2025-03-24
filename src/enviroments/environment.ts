export const environment = {
  production: false,
  apiUrl: 'https://risk-management-riskex-backend-2.onrender.com/api',
  frontendUrl: 'http://localhost:4200',
  ssoConfig: {
    clientId: '4fdd2973-09a8-4c28-a786-16f63cf33207',
    authority: 'https://login.microsoftonline.com/5b751804-232f-410d-bb2f-714e3bb466eb',
    redirectUri: 'http://localhost:4200/auth',
    postLogoutRedirectUri: 'http://localhost:4200/sso'
  }
};
