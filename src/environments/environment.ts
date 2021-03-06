// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiurl: 'http://localhost:9000',
  tokenWhitelist: ['localhost:9000'],

  // apiurl: 'https://shop.japan-impact.ch/api',
  // tokenWhitelist: ['shop.japan-impact.ch'],
  sumUpKey: 'a-wrong-key',
  sumUpApp: 'japan_impact',
  baseUrl: 'http://localhost:9000'
};
