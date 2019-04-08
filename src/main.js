import clone from 'clone-deep'
import merge from 'deepmerge'
import {assert} from './utils/warn'
import pathToRegexp from 'path-to-regexp'
import compose from 'koa-compose'

export default class APIra {
  static _clear (config) {
    delete config.url
    delete config.params
    delete config.data
  }

  constructor (options) {
    const {
      config = {},
      hooks = [],
      adapter
    } = options
    this._adapter = adapter
    this._config = config
    this._genUriFn = null
    this._queueHooks = Array.isArray(hooks) ? hooks : [hooks]

    if (options instanceof APIra) {
      const cloned = options._clone()
      this._config = cloned._config
      this._queueHooks = cloned._queueHooks
      this._adapter = cloned._adapter
    }
    this.GET = this.GET.bind(this)
    this.PUT = this.PUT.bind(this)
    this.POST = this.POST.bind(this)
    this.DELETE = this.DELETE.bind(this)
  }

  _request () {
    assert(this._genUriFn == null, 'Undefined url: Set url before add params! Use .url() method ')
    if (this._config.url == null) {
      this._config.url = this._genUriFn({})
    }
    const requestHook = async (ctx, next) => {
      ctx.response = await this._adapter(this._config)
      next()
    }
    const fn = compose([...this._queueHooks, requestHook])
    const context = {
      response: null,
      APIra: this
    }

    return fn(context)
      .finally(() => { APIra._clear(this._config) })
      .then(() => context)
  }
  _clone () {
    const cloned = clone(this)
    APIra._clear(cloned)
    return cloned
  }

  extend () {
    const cloned = this._clone()
    return new APIra({
      config: cloned._config,
      hooks: cloned._queueHooks,
      adapter: this._adapter
    })
  }
  options (options) {
    this._config = merge(this._config, options)
    return this
  }

  hook (hookFn) {
    this._queueHooks.push(hookFn)
    return this
  }

  url (path) {
    this._genUriFn = pathToRegexp.compile(path)
    return this
  }
  params (params) {
    assert(this._genUriFn == null, 'Undefined url: Set url before add params! Use .url(path) method.')
    this._config.url = this._genUriFn(params)
    return this
  }
  query (query) {
    this._config.params = query
    return this
  }
  data (data) {
    this._config.data = data
    return this
  }

  inspect () {
    return clone(this._config)
  }
  GET () {
    this._config.method = 'get'
    return this._request()
  }
  PUT () {
    this._config.method = 'put'
    return this._request()
  }
  POST () {
    this._config.method = 'post'
    return this._request()
  }
  DELETE () {
    this._config.method = 'delete'
    return this._request()
  }
}
