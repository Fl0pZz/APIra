import mockAxios from 'jest-mock-axios'
import APIra from '../src/main'

let api

beforeEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset()
  api = new APIra({ adapter: mockAxios })
})

it ('Test exception: Undefined url', async () => {
  expect.assertions(2)

  expect(() => api.params({ id: 10 })).toThrowError(/Undefined url/)

  try {
    await api._request()
  } catch (e) {
    expect(e.message).toMatch(/Undefined url/)
  }
})

it ('Test generated axios config', () => {
  const clientData = { a: false, b: 'b'}

  api
    .url('http://testserver.ru/api/v1/user/:id')
    .params({ id: 10 })
    .data(clientData)
    .GET()

  expect(mockAxios).toHaveBeenCalledWith(
    {
      url: 'http://testserver.ru/api/v1/user/10',
      method: 'get',
      data: clientData
    }
  );
})

it ('Test hooks', () => {
  const hook = jest.fn(async (ctx, next) => {
    await next()
  })
  api
    .hook(hook)
    .url('http://testserver.ru/api/v1/user/:id')
    .params({ id: 10 })
    .data({ a: false, b: 'b'})
    .GET()
})

it ('Test extend', () => {
  const hook = async (ctx, next) => {
    await next()
  }
  api
    .hook(hook)
    .url('http://testserver.ru/api/v1/user/:id')
    .params({ id: 10 })
    .options({
      headers: {
        Authorization: 'Bearer SomeToken'
      }
    })
  const extend = api.extend()
  expect(extend._config).toEqual(api._config)

  extend.options({
    headers: {
      Authorization: 'Bearer OtherToken'
    }
  })

  expect(extend._config).not.toEqual(api._config);
})

it ('Test on immutable', () => {
  const apira$1 = api
    .url('http://testserver.ru/api/v1/user/:id')
    .params({ id: 10 })
  const apira$2 = apira$1.params({ id: 20 })
  expect(apira$2._config).not.toEqual(apira$1._config);
})