# REST API USING DENO, MONGODB

## denon for auto reload
```bash
deno install --allow-read --allow-run --allow-write -f --unstable https://deno.land/x/denon@v2.0.2/denon.ts
```

```bash
denon start
```

## start server

```bash
deno run --allow-run --allow-net --allow-write --allow-read --allow-plugin --allow-env --unstable server.ts
```

## .env file in root directory

```
JWT_SECRET=secret
```