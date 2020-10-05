# Teach Other

Teach other is a private lesson scheduling service for college students.

This was the final project from an University class called "Projeto Transversal 1" (University of Brasília - Network Engineering)

## YouTube tutorial

You can watch a full tutorial about this project on [YouTube](https://www.youtube.com/watch?v=MeYibJFi7p0&list=PLbV6TI03ZWYVxGBKyYJf_Qy6d4saMbCq3&index=2).

## How to run this website

- Create your own **.env.local** file based on **.env.example** (Create a mongoDB instance on MongoDB Atlas or docker container and paste the database url on **.env.local**).

- Install all dependencies with yarn:
```bash
yarn
```

- Start dev server:
```bash
yarn dev
```

## Technologies used
- Node
- Yarn
- Typescript
- Next.js
- NextAuth (Authentication)
- Auth0
- Tailwind CSS
- SWR (Client side caching)
- MongoDB Atlas (cloud database as a service)
- Vercel (hosting)

## Features included
- Authentication (create account/login)
- List teachers by class
- Schedule a private lesson
- Evaluate teacher after class
- Spend and recieve a digital currency

<!-- ## Live version

You can visit the live version of Teach Other on https://teach-other.vercel.app -->