# Users API

## Authentication

Для защиты ресурсов используется JWT-токен, который передается в заголовке `Authorization`:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Login

**POST** `/users/login`

Краткое описание: Аутентификация пользователя и получение JWT-токена.

#### Параметры

**Тело запроса (Body)**:

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `email` | string | Да | Email пользователя |
| `password` | string | Да | Пароль пользователя |

#### Заголовки

| Заголовок | Значение |
|-----------|----------|
| `Content-Type` | `application/json` |

#### Пример запроса

```json
{
  "email": "user@example.com",
  "password": "secure_password123"
}
```

#### Пример ответа (успех)

```json
{
  "access_token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx"
}
```

#### Ошибки

| Код | Причина |
|-----|---------|
| `401 Unauthorized` | Неверные учетные данные (email или пароль не совпадают) |
| `500 Internal Server Error` | Внутренняя ошибка сервера |

---

### 2. Register

**POST** `/users/register`

Краткое описание: Регистрация нового пользователя.

#### Параметры

**Тело запроса (Body)**:

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `email` | string | Да | Email пользователя |
| `password` | string | Да | Пароль пользователя |
| `name` | string | Да | Имя пользователя |
| `surname` | string | Да | Фамилия пользователя |
| `avatar` | string | Нет | Base64-encoded изображение (по умолчанию: `"Null"`) |

#### Заголовки

| Заголовок | Значение |
|-----------|----------|
| `Content-Type` | `application/json` |

#### Пример запроса

```json
{
  "email": "newuser@example.com",
  "password": "secure_password123",
  "name": "Ivan",
  "surname": "Ivanov",
  "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

#### Пример ответа (успех)

```json
{
  "access_token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx"
}
```

#### Ошибки

| Код | Причина |
|-----|---------|
| `409 Conflict` | Пользователь с таким email уже зарегистрирован |
| `500 Internal Server Error` | Внутренняя ошибка сервера |

---

### 3. Auth User (Проверка токена)

**GET** `/users/auth`

Краткое описание: Проверка валидности JWT-токена. Не требует аутентификации (используется для валидации токена).

#### Параметры

**Заголовки**:

| Заголовок | Обязательный | Описание |
|-----------|--------------|----------|
| `Authorization` | Да | JWT-токен в формате `Bearer <token>` |

#### Пример заголовков

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

#### Пример ответа (успех)

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "role": "user"
}
```

#### Ошибки

| Код | Причина |
|-----|---------|
| `400 Bad Request` | Неверный формат токена (отсутствует префикс `Bearer`) или токен не прошел декодирование (просрочен/изменен) |

---

### 4. Get User Info

**GET** `/users/get_info`

Краткое описание: Получение полной информации о текущем пользователе.

#### Параметры

**Заголовки**:

| Заголовок | Обязательный | Описание |
|-----------|--------------|----------|
| `Authorization` | Да | JWT-токен в формате `Bearer <token>` |

#### Пример заголовков

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

#### Пример ответа (успех)

```json
{
  "info": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "Ivan",
    "surname": "Ivanov",
    "avatar": "/path/to/avatar.png",
    "role": "user"
  }
}
```

#### Ошибки

| Код | Причина |
|-----|---------|
| `400 Bad Request` | Неверный формат токена |
| `404 Not Found` | Пользователь не найден (токер содержит несуществующий ID) |

---

### 5. Get All Users (только администратор)

**GET** `/users/all`

Краткое описание: Получение списка всех пользователей системы. Доступно только администраторам.

#### Параметры

**Заголовки**:

| Заголовок | Обязательный | Описание |
|-----------|--------------|----------|
| `Authorization` | Да | JWT-токен в формате `Bearer <token>`, где токен принадлежит пользователю с ролью `admin` |

#### Пример заголовков

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin_token
```

#### Пример ответа (успех)

```json
{
  "users": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "password": "hashed_password",
      "name": "Ivan",
      "surname": "Ivanov",
      "avatar": "/path/to/avatar.png",
      "role": "user"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "email": "admin@example.com",
      "password": "hashed_password",
      "name": "Admin",
      "surname": "Adminov",
      "avatar": "admin_avatar.png",
      "role": "admin"
    }
  ]
}
```

#### Ошибки

| Код | Причина |
|-----|---------|
| `400 Bad Request` | Неверный формат токена |
| `403 Forbidden` | Пользователь не является администратором |
| `404 Not Found` | Пользователь не найден (токер содержит несуществующий ID) |

---

## Роли пользователей

| Роль | Описание |
|------|----------|
| `user` | Обычный пользователь |
| `admin` | Администратор (имеет доступ к `/users/all`) |

---

## Описание полей ответов

### User Object

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | string (UUID) | Уникальный идентификатор пользователя |
| `email` | string | Электронная почта |
| `name` | string | Имя |
| `surname` | string | Фамилия |
| `avatar` | string \| null | Путь к аватару |
| `role` | string | Роль пользователя (`user` или `admin`) |

### AuthUserResponse Object

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | string (UUID) | Уникальный идентификатор пользователя |
| `email` | string | Электронная почта |
| `role` | string | Роль пользователя |

---

## Примечания

1. Пароли хранятся в виде хеша SHA-256.
2. JWT-токены подписываются алгоритмом HS256 с использованием секретного ключа из переменной окружения `JWT_SECRET_KEY`.
3. Аватары передаются в формате Base64.
4. Все ресурсы, кроме `/users/login`, `/users/register` и `/users/auth`, требуют аутентификации.
