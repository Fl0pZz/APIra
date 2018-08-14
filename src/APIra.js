import clone from 'clone-deep'
import merge from 'deepmerge'
import {assert} from "./utils/warn";
import pathToRegexp from "path-to-regexp"
import compose from 'koa-compose'

class APIra {
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
    this._isAPIraInstance = true
    this._adapter = adapter
    this._config = config
    this._rawUrl = null
    this._queueHooks = hooks
    this._requestCalled = false
    if (options instanceof APIra) {
      const cloned = options._clone()
      this._config = cloned._config
      this._queueHooks = cloned._queueHooks
      this._adapter = cloned._adapter
    }

    this.isCalled = false
    this.isPending = false
    this.isResolved = false
    this.isRejected = false
  }

  _request () {
    assert(this._rawUrl == null, 'Undefined url: Set url before add params! Use .url() method ')
    if (!this._requestCalled) {
      this._queueHooks.push((ctx, next) => this._adapter(this._config)
        .then(response => {
          ctx.response = response
          next()
        })
      )
      this._requestCalled = true
    }
    const fn = compose(this._queueHooks)
    const context = {
      response: null,
      APIra: this
    }

    return fn(context).then(() => context)
  }
  _clone () {
    const cloned = clone(this)
    APIra._clear(cloned)
    return cloned
  }


  resolved (cb = null) {
    this.isPending = false
    this.isResolved = true
    cb && cb()
  }
  rejected (cb = null) {
    this.isPending = false
    this.isRejected = true
    cb && cb()
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
    this._rawUrl = pathToRegexp.compile(path)
    return this
  }
  params (params) {
    assert(this._rawUrl == null, 'Undefined url: Set url before add params! Use .url() method ')
    this._config.url = this._rawUrl(params)
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

export default APIra
