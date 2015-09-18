'use strict';

var fieldCharsRe = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

function Cookie (cookie) {
  if (typeof cookie !== 'string') {
    throw new TypeError('Cookie constructor requires a string');
  }

  this.name = null;
  this.value = null;
  this.domain = null;
  this.path = null;
  this.secure = false;
  this.httpOnly = false;
  this.expires = Infinity;
  this.maxAge = Infinity;
  this.expiration = Infinity;
  this.input = {
    cookie: cookie,
    name: null,
    value: null,
    domain: null,
    path: null,
    secure: null,
    httpOnly: null,
    expires: null,
    maxAge: null
  };

  var pairs = cookie.split(/; */);

  for (var i = 0; i < pairs.length; ++i) {
    var pair = pairs[i];
    var index = pair.indexOf('=');
    var rawName = (index < 0 ? pair : pair.substr(0, index)).trim();
    var rawValue = index < 0 ? null : pair.substr(index + 1).trim();

    if ((rawName && fieldCharsRe.test(rawName) === false) ||
        (rawValue && fieldCharsRe.test(rawValue) === false)) {
      throw new RangeError('Cookie contains invalid characters');
    }

    var name = rawName.toLowerCase();
    var value = rawValue === null ? null : tryDecode(rawValue);
    var parsed;

    if (i === 0) {
      this.name = rawName;
      this.value = value;
      this.input.name = rawName;
      this.input.value = rawValue;
    } else if (name === 'domain') {
      if (value !== null && value !== '') {
        this.domain = value.toLowerCase();
      }

      this.input.domain = rawValue;
    } else if (name === 'path') {
      if (value !== null && /^\//.test(value)) {
        this.path = value;
      }

      this.input.path = rawValue;
    } else if (name === 'secure') {
      this.secure = true;
      this.input.secure = rawName;
    } else if (name === 'httponly') {
      this.httpOnly = true;
      this.input.httpOnly = rawName;
    } else if (name === 'expires') {
      parsed = Date.parse(value);

      if (parsed >= 0) {
        this.expires = Date.parse(value);
      } else {
        this.expires = Infinity;
      }

      this.input.expires = rawValue;
    } else if (name === 'max-age') {
      parsed = value >>> 0;

      if ((parsed + '') === value) {
        this.maxAge = parsed;
      }

      this.input.maxAge = rawValue;
    }
  }

  // Set expiration time. Max-Age overrides Expires
  if (this.maxAge !== Infinity) {
    this.expiration = Date.now() + (this.maxAge * 1000);
  } else if (this.expires !== Infinity) {
    this.expiration = this.expires;
  }
}

module.exports = Cookie;

function tryDecode (str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return str;
  }
}

Cookie.prototype.toRequestCookie = function () {
  if (this.value === null) {
    return this.name;
  }

  return this.name + '=' + encodeURIComponent(this.value);
};

Cookie.prototype.toString = function () {
  var pairs = [];

  if (this.value !== null) {
    pairs.push(this.name + '=' + encodeURIComponent(this.value));
  } else {
    pairs.push(this.name);
  }

  if (this.domain !== null) {
    pairs.push('domain=' + this.domain);
  }

  if (this.path === null) {
    pairs.push('path=/');
  } else {
    pairs.push('path=' + this.path);
  }

  if (this.expires !== Infinity) {
    pairs.push('expires=' + (new Date(this.expires).toUTCString()));
  }

  if (this.maxAge !== Infinity) {
    pairs.push('max-age=' + this.maxAge);
  }

  if (this.secure) {
    pairs.push('secure');
  }

  if (this.httpOnly) {
    pairs.push('httponly');
  }

  return pairs.join('; ');
};
