# Project Setup and Database Management

## Installation and Running
To install project dependencies:
```sh
bun install
```

To start the development server:
```sh
bun run dev
```

## Database Setup with Drizzle

### Initial Setup
1. Start the database container:
```sh
docker-compose up
```

2. Configure environment variables:
Add the following to your `.env` file:
```
DATABASE_URL=mysql://user:userpassword@localhost:3307/mydb
```

### Database Migrations
To apply existing migrations:
```sh
bun run migrate
```

To create and apply new migrations:
1. Edit the schema in `/db/schema.ts`
2. Generate migration files:
```sh
bun run migrate:generate
```
3. Apply the new migrations:
```sh
bun run migrate
```

### Database Management
To access the database GUI:
```sh
bun run studio
```
