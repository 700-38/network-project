# Deploying Frontend on Cloudflare Workers with Wrangler

This guide will walk you through the steps to deploy a Next.js build on Cloudflare Workers using Wrangler.

## Prerequisites

Before you begin, make sure you have the following:

- A Next.js project with a build ready.
- Node.js and npm installed on your machine.
- A Cloudflare account.
- Wrangler CLI installed. You can install it by running the following command:

  ```shell
  bun i -g @cloudflare/wrangler
  ```

- Wrangler Login:

  ```shell
  bunx wrangler login
  ```

## For develop:

1. Install depenency:

   ```shell
   bun i
   ```

2. Run the development server:

   ```shell
   bun run dev
   ```

## For deployment:

1. Install depenency:

   ```shell
   bun i
   ```

2. Update the generated `wrangler.toml` file with your Cloudflare account details. Make sure to set the `account_id` and `zone_id` fields.

3. Build your Next.js project:

   ```shell
   bun run build
   ```

4. Deploy your Next.js build to Cloudflare Workers:

   ```shell
   bunx wrangler pages deploy ./out
   ```

5. After the deployment is successful, you will receive a URL for your deployed Next.js application.

## Conclusion

Congratulations! You have successfully deployed your Next.js build on Cloudflare Workers using Wrangler. You can now access your application using the provided URL.

For more information on Cloudflare Workers and Wrangler, refer to the official documentation.
