import { Environment } from './environment.interface';

declare let injectedEnvironment: any;

export const environment = ((): Environment => {
  if (typeof injectedEnvironment !== 'undefined') {
    console.debug(
      ' loaded environment ',
      injectedEnvironment
        ? 'loaded injectedEnvironment'
        : 'default to environment default'
    );

    console.debug(injectedEnvironment);
    return injectedEnvironment;
  }
  //needed for development environment when not run with npm run dev:ssr
  return {
    apiUrl: 'http://localhost:8000',
    production: false,
  };
})();
