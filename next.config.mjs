import { env } from './src/server/env.mjs';

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  publicRuntimeConfig: {
    appName: process.env.APP_NAME,
    host: process.env.HOST,
    port: process.env.PORT,
    port: process.env.PORT,
    environment: process.env.NODE_ENV,
    publicDomain: process.env.PUBLIC_DOMAIN,
  },
});
