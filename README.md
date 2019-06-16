# APIra

Простая библиотека для формирования запросов. Является оберткой над axios

### Основные возможности:
* Хуки с интерфейсом middleware из koa (используется [koa-compose](https://github.com/koajs/compose))
* Поддержка параметров url (спасибо [pathToRegexp](https://github.com/pillarjs/path-to-regexp)), например `http://example.ru/users/:id`
* Возможность настройки конфига axios

## Примеры

Создание:
```js
import axios from 'axios'

const api = new APIra({ adapter: axios.create() })
```
<br>

Отправка запроса:
```js
api
  .url('http://example.ru/users/:id')
  .params({
    id: 10
  })
  .query({
    filter_a: 'a',
    filter_b: 'b'
  })
  .GET()


api
  .url('http://example.ru/users/:id')
  .params({
    id: 1
  })
  .data({
    someData: 'someData'
  })
  .POST()
```
<br>

Использование хуков:
```js
const logHook = async (ctx, next) => {
  console.log(ctx.response) // response == null
  await next()
  console.log(ctx.response) // response != null
}

api
  .hook(logHook)
  .url('http://example.ru/users/:id')
  .params({
    id: 10
  })
  .query({
    filter_a: 'a',
    filter_b: 'b'
  })
  .GET()
```
<br>

Наследование:
```js
const api = new APIra({ adapter: axios.create() })

api
  .hook(logHook)
  .options({
    headers: {
      Authorization: 'Bearer SomeToken'
    }
  })

const api_v2 = api.extend()
```
<br>

## API
**APIra**

APIra reference

```js
import APIra from 'apira'
```
<br>

**constructor**

`const api = new APIra([config], [hooks], [adapter])`

| Параметр | Тип          | Описание |
|----------|--------------|----------|
| config   | `object`     | [Настройки axios](https://github.com/axios/axios#request-config) |
| hooks    | `function[]` | Массив хуков |
| adapter  | `function`   | [Инстанс axios](https://github.com/axios/axios#creating-an-instance) (или его mock) |
<br>

**hook**

`api.hook([hookFn])`

Добавляет хук в очередь

| Параметр | Тип          | Описание |
|----------|--------------|----------|
| [hookFn]   | `Function` | Принимаются **только**<br> **асинхронные** функции |
<br>

**url**

`api.url(urlPath)`

Задает URL, по которому будет выполняться запрос

| Параметр | Тип          | Описание |
|----------|--------------|----------|
| urlPath   | `string`    | URL-адрес |
<br>

**params**

`api.params([options])`

Задает параметры для URL'a.

| Параметр | Тип          | Описание |
|----------|--------------|----------|
| [options]   | `object`    | Объект параметров |

Пример объекта параметров для `https://example.ru/users/:userId/comments/:commentId`:

```js
{
  userId: id,
  commentId: id
}
```
<br>

**query**

`api.query([queryOptions])`

Создает из объекта queryString

| Параметр | Тип          | Описание |
|----------|--------------|----------|
| [queryOptions]   | `object`    | Объект query параметров |

Пример query-объекта для `foo=bar&abc=xyz`:

```js
{
  foo: 'bar',
  abc: 'xyz'
}
```
<br>

**data**

`api.data([dataOptions])`

Задает тело запроса

| Параметр | Тип          | Описание |
|----------|--------------|----------|
| [dataOptions]   | `object` | Объект data параметров  |

Пример data-объекта:

```js
{
  user_id: id
}
```
<br>

**options**

`api.options([options])`

Позволяет дополнить дефолтный конфиг axios

| Параметр | Тип          | Описание |
|----------|--------------|----------|
| [options]   | `object` | Объект [axios параметров](https://github.com/axios/axios#request-config) |

Пример объекта axios параметров:

```js
{
  baseURL: '/api/v1/'
}
```
<br>

**GET | POST | PUT | DELETE**

```js
api
  .url('http://example.ru/users/:id')
  .GET()
```

Функции вызова соответсвующих методов

<br>

**inspect**

`api.inspect()`

Возвращает конфиг axios

<br>

**extend**

`const api_v2 = api.extend()`

Позволяет скопировать инстанс, сохраняя adapter, config и hooks

<br>

## TODO
* Оптимизировать сборку
