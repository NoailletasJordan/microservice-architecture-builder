import {
  IconBrandAdonisJs,
  IconBrandAlipay,
  IconBrandAlpineJs,
  IconBrandAngular,
  IconBrandAstro,
  IconBrandAuth0,
  IconBrandAws,
  IconBrandCSharp,
  IconBrandCouchdb,
  IconBrandDjango,
  IconBrandElastic,
  IconBrandFirebase,
  IconBrandGolang,
  IconBrandHtml5,
  IconBrandLaravel,
  IconBrandMailgun,
  IconBrandMongodb,
  IconBrandMysql,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandNotion,
  IconBrandNuxt,
  IconBrandPaypal,
  IconBrandPython,
  IconBrandReact,
  IconBrandSolidjs,
  IconBrandStripe,
  IconBrandSupabase,
  IconBrandSvelte,
  IconBrandSymfony,
  IconBrandVue,
  IconBrandWindows,
  IconDatabaseLeak,
  IconDiamond,
  IconEyeDotted,
  IconInfinity,
  IconKey,
  IconLemon2,
  IconMug,
  IconOctagon,
  IconSend,
  IconSql,
  IconStackFront,
} from '@tabler/icons-react'

export const technologyFrontend = {
  Alpine: { underlying: 'js', color: 'yellow', icon: IconBrandAlpineJs },
  Angular: { underlying: 'js', color: 'yellow', icon: IconBrandAngular },
  Django: { underlying: 'python', color: 'blue', icon: IconBrandDjango },
  Golang: { underlying: 'go', color: 'teal', icon: IconBrandGolang },
  Laravel: { underlying: 'php', color: 'teal', icon: IconBrandLaravel },
  Next: { underlying: 'js', color: 'yellow', icon: IconBrandNextjs },
  Nuxt: { underlying: 'js', color: 'yellow', icon: IconBrandNuxt },
  React: { underlying: 'js', color: 'yellow', icon: IconBrandReact },
  Solid: { underlying: 'js', color: 'yellow', icon: IconBrandSolidjs },
  Svelte: { underlying: 'js', color: 'yellow', icon: IconBrandSvelte },
  Symfony: { underlying: 'php', color: 'teal', icon: IconBrandSymfony },
  Vanilla: { underlying: 'html', color: 'blue', icon: IconBrandHtml5 },
  Vue: { underlying: 'js', color: 'yellow', icon: IconBrandVue },
  Any: { underlying: 'other', color: 'grey', icon: IconInfinity },
} as const

export const technologyServer = {
  Adonis: { underlying: 'js', color: 'yellow', icon: IconBrandAdonisJs },
  ASPNET: { underlying: 'csharp', color: 'blue', icon: IconBrandCSharp },
  Astro: { underlying: 'js', color: 'yellow', icon: IconBrandAstro },
  Chi: { underlying: 'go', color: 'teal', icon: IconBrandGolang },
  Django: { underlying: 'python', color: 'blue', icon: IconBrandDjango },
  Echo: { underlying: 'go', color: 'teal', icon: IconBrandGolang },
  Express: { underlying: 'js', color: 'yellow', icon: IconBrandNodejs },
  FastAPI: { underlying: 'python', color: 'blue', icon: IconBrandPython },
  Fiber: { underlying: 'go', color: 'teal', icon: IconBrandGolang },
  Flask: { underlying: 'python', color: 'blue', icon: IconBrandPython },
  GoGin: { underlying: 'go', color: 'teal', icon: IconBrandGolang },
  Golang: { underlying: 'go', color: 'teal', icon: IconBrandGolang },
  Java: { underlying: 'java', color: 'red', icon: IconMug },
  Koa: { underlying: 'js', color: 'yellow', icon: IconBrandNodejs },
  Laravel: { underlying: 'php', color: 'teal', icon: IconBrandLaravel },
  Nest: { underlying: 'js', color: 'yellow', icon: IconBrandNodejs },
  OnRails: { underlying: 'ruby', color: 'red', icon: IconDiamond },
  Python: { underlying: 'python', color: 'blue', icon: IconBrandPython },
  Spring: { underlying: 'java', color: 'red', icon: IconMug },
  Symfony: { underlying: 'php', color: 'teal', icon: IconBrandSymfony },
  Any: { underlying: 'other', color: 'grey', icon: IconInfinity },
} as const

export const technologyDatabases = {
  Cassandra: { underlying: 'nosql', color: 'orange', icon: IconEyeDotted },
  CouchDB: { underlying: 'nosql', color: 'orange', icon: IconBrandCouchdb },
  DynamoDB: { underlying: 'nosql', color: 'orange', icon: IconDatabaseLeak },
  Elasticsearch: {
    underlying: 'nosql',
    color: 'orange',
    icon: IconBrandElastic,
  },
  Firebase: { underlying: 'nosql', color: 'orange', icon: IconBrandFirebase },
  InfluxDB: { underlying: 'nosql', color: 'orange', icon: IconOctagon },
  MariaDB: { underlying: 'sql', color: 'blue', icon: IconSql },
  MicrosoftSQL: { underlying: 'sql', color: 'blue', icon: IconBrandWindows },
  MongoDB: { underlying: 'nosql', color: 'orange', icon: IconBrandMongodb },
  MySQL: { underlying: 'sql', color: 'blue', icon: IconBrandMysql },
  Notion: { underlying: 'no-code', color: 'purple', icon: IconBrandNotion },
  Oracle: { underlying: 'sql', color: 'blue', icon: IconSql },
  Postgres: { underlying: 'sql', color: 'blue', icon: IconSql },
  Redis: { underlying: 'nosql', color: 'orange', icon: IconStackFront },
  SQLite: { underlying: 'sql', color: 'blue', icon: IconSql },
  Supabase: { underlying: 'sql', color: 'blue', icon: IconBrandSupabase },
  Any: { underlying: 'other', color: 'grey', icon: IconInfinity },
} as const

export const technologyEmailService = {
  Mailchimp: { underlying: 'email', color: 'blue', icon: IconSend },
  Mailgun: { underlying: 'email', color: 'blue', icon: IconBrandMailgun },
  Postmark: { underlying: 'email', color: 'blue', icon: IconSend },
  SES: { underlying: 'email', color: 'blue', icon: IconBrandAws },
  SendGrid: { underlying: 'email', color: 'blue', icon: IconSend },
  SendinBlue: { underlying: 'email', color: 'blue', icon: IconSend },
  Any: { underlying: 'other', color: 'grey', icon: IconInfinity },
} as const

export const technologyAuthService = {
  Auth0: { underlying: 'auth', color: 'green', icon: IconBrandAuth0 },
  Clerk: { underlying: 'auth', color: 'green', icon: IconKey },
  Cognito: { underlying: 'auth', color: 'green', icon: IconBrandAws },
  Firebase: { underlying: 'auth', color: 'green', icon: IconBrandFirebase },
  Golang: { underlying: 'go', color: 'teal', icon: IconBrandGolang },
  Node: { underlying: 'js', color: 'yellow', icon: IconBrandNodejs },
  Python: { underlying: 'python', color: 'blue', icon: IconBrandPython },
  Supabase: { underlying: 'auth', color: 'green', icon: IconBrandSupabase },
  Any: { underlying: 'other', color: 'grey', icon: IconInfinity },
} as const

export const technologyPayment = {
  Alipay: { underlying: 'payment', color: 'green', icon: IconBrandAlipay },
  LemonSqueezie: { underlying: 'payment', color: 'green', icon: IconLemon2 },
  PayPal: { underlying: 'payment', color: 'green', icon: IconBrandPaypal },
  Stripe: { underlying: 'payment', color: 'green', icon: IconBrandStripe },
  Any: { underlying: 'other', color: 'grey', icon: IconInfinity },
} as const

export const combinedTechnologies = {
  ...technologyFrontend,
  ...technologyServer,
  ...technologyDatabases,
  ...technologyEmailService,
  ...technologyAuthService,
  ...technologyPayment,
} as const

export type TechnologiesKeys = keyof typeof combinedTechnologies

// Extracting all `underlying` values from each category
type TechnologyFrontendUnderlying =
  (typeof technologyFrontend)[keyof typeof technologyFrontend]['underlying']
type TechnologyServerUnderlying =
  (typeof technologyServer)[keyof typeof technologyServer]['underlying']
type TechnologyDatabasesUnderlying =
  (typeof technologyDatabases)[keyof typeof technologyDatabases]['underlying']
type TechnologyEmailServiceUnderlying =
  (typeof technologyEmailService)[keyof typeof technologyEmailService]['underlying']
type TechnologyAuthServiceUnderlying =
  (typeof technologyAuthService)[keyof typeof technologyAuthService]['underlying']
type TechnologyPaymentUnderlying =
  (typeof technologyPayment)[keyof typeof technologyPayment]['underlying']

// Union of all `underlying` values
type AllUnderlyingValues =
  | TechnologyFrontendUnderlying
  | TechnologyServerUnderlying
  | TechnologyDatabasesUnderlying
  | TechnologyEmailServiceUnderlying
  | TechnologyAuthServiceUnderlying
  | TechnologyPaymentUnderlying

export type TechnologiesValue = {
  underlying: AllUnderlyingValues
  color: string
  icon: any
}
