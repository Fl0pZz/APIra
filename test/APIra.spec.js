import mockAxios from 'jest-mock-axios'
import APIra from '../src/main'

let api

beforeEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset()
  api = new APIra({ adapter: mockAxios })
})

it ('Create APIra', () => {
  expect(api instanceof APIra).toBeTruthy()
})

it ('Test exception', async () => {
  expect.assertions(2)

  expect(() => api.params({ id: 10 })).toThrowError(/Undefined url/)

  try {
    await api._request()
  } catch (e) {
    expect(e.message).toMatch(/Undefined url/)
  }
})

it ('Test requests', () => {
  const catchFn = jest.fn()
  const thenFn = jest.fn()
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

it ('Test config', () => {
  api
    .url('http://testserver.ru/api/v1/user/:id')
    .params({ id: 10 })
    .data({ a: false, b: 'b'})
    .GET()
})