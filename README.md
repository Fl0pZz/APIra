# APIra

Простая библиотека для формирования запросов. Является оберткой над axios

## Основные возможности:
* Хуки с интерфейсом миддлварей из koa (используется koa-compose)
* Поддержка параметров url (спасибо pathToRegexp), например `http://example.ru/users/:id`
* Доступны флаги выполнения запроса (`isPending`, `isResolved`, `isPending`, `isCalled`),
которые можно использоваться для отображения различных свистоперделок UI
* Возможность настройки конфига axios

## API
#### `constructor ({ config = {}, hooks = [], adapter })`:

  `config`  - любые настройки для axios

  `hooks`   - возможно уже заданные хуки

  `adapter` - инстанс axios или его mock
  
#### `hook (hookFn)` - добавляем хук в очередь

`hookFn` - функция вида `(ctx, next) => { next() }`


#### `url (str)` - задаем урл

#### `params (paramsObj)` - задаем параметры для url. В `http://example.ru/users/:id` параметро является `id`

`paramsObj` - объект с параметрами

#### `query (queryObj)` - задаем queryString

#### `data (dataObj)` - тело запроса

#### `inspect ()` - получаем конфиг axios

#### `GET | POST | PUT | DELETE` - функции вызова соответсвующих методов

#### `options (optionsObj)` - конфига для axios, который будет смержен с дефолтным конфигом

#### `extend ()` - копируем инстанс, сохраняя adapter, config и hooks

## Как выглядят запросы или типичные юзкейсы

Создание:
```js
import axios from 'axios'

const api = new APIra({ adapter: axios.create() })
```

Отправка первого запроса:
```js
api
  .url(http://example.ru/users/:id)
  .params({ id: 10 })
  .query({ filterA: 'a', filterB: 'b' })
  .GET()

api
  .url(http://example.ru/users/:id)
  .params({ id: 10 })
  .data({ someData: 'someData' })
  .POST()
```

Добавим хуков:
```js
const logHook = async (ctx, next) => {
  console.log(ctx.response) // resonse == null
  await next()
  console.log(ctx.response) // resonse != null
}

api
  .hook(logHook)
  .url(http://example.ru/users/:id)
  .params({ id: 10 })
  .query({ filterA: 'a', filterB: 'b' })
  .GET()
```
Наследование:
```js
const apiV1 = new APIra({ adapter: axios.create() })
apiV1
  .hook(logHook)
  .options({
    headers: {
      Authorization: 'Bearer SomeToken'
    }
  })
const apiV2 = apiV1.extend()
```
