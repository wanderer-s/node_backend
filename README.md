# Nestjs Backend

- RESTAPI
- Mysql(docker)
- JWT 인증방식

## 폴더구조

```
src
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── auth
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── jwt
│   │   ├── jwt-auth.guard.ts
│   │   └── jwt-strategy.ts
│   └── local
│       ├── local-auth.guard.ts
│       └── local-strategy.ts
├── common
│   └── entities
│       └── base.entity.ts
├── main.ts
├── orders
│   ├── dto
│   │   ├── orderInit.dto.ts
│   │   ├── orderListResponse.dto.ts
│   │   ├── orderResponse.dto.ts
│   │   └── recipient.dto.ts
│   ├── entities
│   │   └── orders.entity.ts
│   ├── orders.controller.ts
│   ├── orders.module.ts
│   └── orders.service.ts
└── users
    ├── dto
    │   ├── passwordChange.dto.ts
    │   ├── signIn.dto.ts
    │   └── signUp.dto.ts
    ├── entities
    │   └── users.entity.ts
    ├── users.controller.ts
    ├── users.module.ts
    └── users.service.ts
```

## 구동방식

1. `docker-compose up -d` 로 docker로 구성된 mysql 실행
2. `npm install` 로 Node package 설치
3. `npm run start:dev` 로 local에서 실행
4. `http://localhost:3000/doc` api 상세문서화
