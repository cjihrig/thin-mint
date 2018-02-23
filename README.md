# thin-mint

[![Current Version](https://img.shields.io/npm/v/thin-mint.svg)](https://www.npmjs.org/package/thin-mint)
[![Build Status via Travis CI](https://travis-ci.org/continuationlabs/thin-mint.svg?branch=master)](https://travis-ci.org/continuationlabs/thin-mint)
![Dependencies](http://img.shields.io/david/continuationlabs/thin-mint.svg)
[![belly-button-style](https://img.shields.io/badge/eslint-bellybutton-4B32C3.svg)](https://github.com/continuationlabs/belly-button)


HTTP cookie utility. `thin-mint` provides parsing and stringification of individual HTTP cookies.

## Example

```javascript
var ThinMint = require('thin-mint');
var str = 'foo=bar; domain=continuation.io; path=/baz; expires=Sun, 20 Mar 2016 07:05:03 GMT; max-age=1234; secure; httponly';
var cookie = new ThinMint(str);

/*
cookie = {
  name: 'foo',
  value: 'bar',
  domain: 'continuation.io',
  path: '/baz',
  secure: true,
  httpOnly: true,
  expires: 1458457503000,
  maxAge: 1234,
  expiration: 1441772074919,
  input: {
    cookie: 'foo=bar; domain=continuation.io; path=/baz; expires=Sun, 20 Mar 2016 07:05:03 GMT; max-age=1234; secure; httponly',
    name: 'foo',
    value: 'bar',
    domain: 'continuation.io',
    path: '/baz',
    secure: 'secure',
    httpOnly: 'httponly',
    expires: 'Sun, 20 Mar 2016 07:05:03 GMT',
    maxAge: '1234'
  }
}
*/

console.log(cookie.toString());
```

## Methods

### `Cookie(cookieStr)` Constructor

- Arguments
  - `cookieStr` (string) - An HTTP cookie
- Constructs
  - object - An object representation of the `cookieStr` argument with the following schema:
    - `name` (string) - The cookie name. Defaults to `null`.
    - `value` (string) - The cookie value, as parsed by `decodeURIComponent()``. Defaults to `null`.
    - `domain` (string) - The cookie domain, converted to lowercase. Defaults to `null`.
    - `path` (string) - The cookie path, which must begin with `/`. Defaults to `null`.
    - `secure` (boolean) - The cookie's `secure` attribute. Defaults to `false`.
    - `httpOnly` (boolean) - The cookie's `httpOnly` attribute. Defaults to `false`.
    - `expires` (number) - The cookie's `expires` attribute passed through `Date.parse()`. Defaults to `Infinity`.
    - `maxAge` (number) - The cookie's `max-age` attribute. Defaults to `Infinity`.
    - `expiration` (number) - The cookie's expiration time. Uses `max-age`, or falls back to `expires`. Defaults to `Infinity` if neither are provided.
    - `input` (object) - An object containing the raw input values without any processing. Contains the following properties.
      - `cookie` (string) - The original string passed to the constructor.
      - `name` (string) - The cookie name. Defaults to `null`.
      - `value` (string) - The cookie value. Defaults to `null`.
      - `domain` (string) - The cookie domain. Defaults to `null`.
      - `path` (string) - The cookie path. Defaults to `null`.
      - `secure` (string) - The cookie's `secure` attribute. Defaults to `null`.
      - `httpOnly` (string) - The cookie's `httpOnly` attribute. Defaults to `null`.
      - `expires` (string) - The cookie's `expires` attribute. Defaults to `null`.
      - `maxAge` (string) - The cookie's `max-age` attribute. Defaults to `null`.

### `Cookie.prototype.toRequestCookie()`

  - Arguments
    - None
  - Returns
    - string - Request cookie string representation of the cookie. If the cookie has a value, then the string will be of the form `name=value`, where `value` is encoded using `encodeURIComponent()`. If the cookie has no value, then the string is just the cookie name.

Converts the `Cookie` into a request cookie string.

### `Cookie.prototype.toString()`

- Arguments
  - None
- Returns
  - string - String representation of the cookie containing all fields.

Creates a string representation of the `Cookie` object.
