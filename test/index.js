'use strict';
var Code = require('code');
var Lab = require('lab');
var ThinMint = require('../lib');

var lab = exports.lab = Lab.script();
var expect = Code.expect;
var describe = lab.describe;
var it = lab.it;

Code.settings.truncateMessages = false;
Code.settings.comparePrototypes = false;

function create (str) {
  return new ThinMint(str);
}

describe('ThinMint', function () {
  describe('Cookie()', function () {
    it('parses cookie name and value', function (done) {
      var cookie = create('foo=bar');
      expect(cookie.name).to.equal('foo');
      expect(cookie.value).to.equal('bar');
      expect(cookie.input.name).to.equal('foo');
      expect(cookie.input.value).to.equal('bar');

      cookie = create('foo=');
      expect(cookie.name).to.equal('foo');
      expect(cookie.value).to.equal('');
      expect(cookie.input.name).to.equal('foo');
      expect(cookie.input.value).to.equal('');

      cookie = create('FOO;');
      expect(cookie.name).to.equal('FOO');
      expect(cookie.value).to.equal(null);
      expect(cookie.input.name).to.equal('FOO');
      expect(cookie.input.value).to.equal(null);

      cookie = create('foo');
      expect(cookie.name).to.equal('foo');
      expect(cookie.value).to.equal(null);
      expect(cookie.input.name).to.equal('foo');
      expect(cookie.input.value).to.equal(null);

      cookie = create('foo=bar baz;');
      expect(cookie.name).to.equal('foo');
      expect(cookie.value).to.equal('bar baz');
      expect(cookie.input.name).to.equal('foo');
      expect(cookie.input.value).to.equal('bar baz');

      cookie = create('foo=bar=baz;');
      expect(cookie.name).to.equal('foo');
      expect(cookie.value).to.equal('bar=baz');
      expect(cookie.input.name).to.equal('foo');
      expect(cookie.input.value).to.equal('bar=baz');

      done();
    });

    it('handles encoded values', function (done) {
      var cookie = create('foo=a%20b%20c');

      expect(cookie.name).to.equal('foo');
      expect(cookie.value).to.equal('a b c');
      expect(cookie.input.name).to.equal('foo');
      expect(cookie.input.value).to.equal('a%20b%20c');
      done();
    });

    it('handles errors while decoding values', function (done) {
      // '%' causes decodeURIComponent() to throw
      var cookie = create('foo=%');

      expect(cookie.name).to.equal('foo');
      expect(cookie.value).to.equal('%');
      expect(cookie.input.name).to.equal('foo');
      expect(cookie.input.value).to.equal('%');
      done();
    });

    it('parses cookie domain', function (done) {
      var cookie = create('foo=bar; domain=google.com');
      expect(cookie.domain).to.equal('google.com');
      expect(cookie.input.domain).to.equal('google.com');

      cookie = create('foo=bar; domain=GOOGLE.COM');
      expect(cookie.domain).to.equal('google.com');
      expect(cookie.input.domain).to.equal('GOOGLE.COM');

      done();
    });

    it('domain defaults to null', function (done) {
      var cookie = create('foo=bar; domain=');
      expect(cookie.domain).to.equal(null);
      expect(cookie.input.domain).to.equal('');

      cookie = create('foo=bar; domain');
      expect(cookie.domain).to.equal(null);
      expect(cookie.input.domain).to.equal(null);

      done();
    });

    it('parses cookie path', function (done) {
      var cookie = create('foo=bar; path=/baz');
      expect(cookie.path).to.equal('/baz');
      expect(cookie.input.path).to.equal('/baz');

      cookie = create('foo=bar;Path=/baz/buz;');
      expect(cookie.path).to.equal('/baz/buz');
      expect(cookie.input.path).to.equal('/baz/buz');

      done();
    });

    it('does not set path when an invalid path is provided', function (done) {
      var cookie = create('foo=bar; path=baz');
      expect(cookie.path).to.equal(null);
      expect(cookie.input.path).to.equal('baz');

      cookie = create('foo=bar; path=');
      expect(cookie.path).to.equal(null);
      expect(cookie.input.path).to.equal('');

      cookie = create('foo=bar; path=    ;');
      expect(cookie.path).to.equal(null);
      expect(cookie.input.path).to.equal('');

      cookie = create('foo=bar; path');
      expect(cookie.path).to.equal(null);
      expect(cookie.input.path).to.equal(null);

      done();
    });

    it('parses secure option', function (done) {
      var cookie = create('foo=bar; secure;');
      expect(cookie.secure).to.equal(true);
      expect(cookie.input.secure).to.equal('secure');

      cookie = create('foo=bar; SECURE');
      expect(cookie.secure).to.equal(true);
      expect(cookie.input.secure).to.equal('SECURE');

      done();
    });

    it('ignores values on secure', function (done) {
      var cookie = create('foo=bar; secure=false;');
      expect(cookie.secure).to.equal(true);
      expect(cookie.input.secure).to.equal('secure');

      cookie = create('foo=bar; secure=');
      expect(cookie.secure).to.equal(true);
      expect(cookie.input.secure).to.equal('secure');

      done();
    });

    it('parses httpOnly option', function (done) {
      var cookie = create('foo=bar;    httpOnly;');
      expect(cookie.httpOnly).to.equal(true);
      expect(cookie.input.httpOnly).to.equal('httpOnly');

      cookie = create('foo=bar; HTTPONLY');
      expect(cookie.httpOnly).to.equal(true);
      expect(cookie.input.httpOnly).to.equal('HTTPONLY');

      done();
    });

    it('ignores values on httpOnly', function (done) {
      var cookie = create('foo=bar; httpOnly=false;');
      expect(cookie.httpOnly).to.equal(true);
      expect(cookie.input.httpOnly).to.equal('httpOnly');

      cookie = create('foo=bar; httpOnly=');
      expect(cookie.httpOnly).to.equal(true);
      expect(cookie.input.httpOnly).to.equal('httpOnly');

      done();
    });

    it('parses max-age option', function (done) {
      var cookie = create('foo=bar; Max-Age=9001');
      expect(cookie.maxAge).to.equal(9001);
      expect(cookie.input.maxAge).to.equal('9001');

      done();
    });

    it('max-age defaults to Infinity', function (done) {
      var cookie = create('foo=bar; Max-Age=');
      expect(cookie.maxAge).to.equal(Infinity);
      expect(cookie.input.maxAge).to.equal('');

      cookie = create('foo=bar; max-age;');
      expect(cookie.maxAge).to.equal(Infinity);
      expect(cookie.input.maxAge).to.equal(null);

      cookie = create('foo=bar; max-age=   baz');
      expect(cookie.maxAge).to.equal(Infinity);
      expect(cookie.input.maxAge).to.equal('baz');

      cookie = create('foo=bar; max-age=baz;');
      expect(cookie.maxAge).to.equal(Infinity);
      expect(cookie.input.maxAge).to.equal('baz');

      done();
    });

    it('parses expires option', function (done) {
      var date = 'Sun, 20 Mar 2016 07:05:03 GMT';
      var cookie = create('foo=bar; Expires=' + date);
      expect(cookie.expires).to.be.a.number();
      expect(cookie.expires).to.equal(Date.parse(date));
      expect(new Date(cookie.expires).toUTCString()).to.equal(date);
      expect(cookie.input.expires).to.equal(date);
      done();
    });

    it('sets expires to Infinity if invalid date is passed', function (done) {
      var cookie = create('foo=bar; Expires=');
      expect(cookie.expires).to.be.a.number();
      expect(cookie.expires).to.equal(Infinity);
      expect(cookie.input.expires).to.equal('');

      cookie = create('foo=bar; Expires');
      expect(cookie.expires).to.equal(Infinity);
      expect(cookie.input.expires).to.equal(null);

      cookie = create('foo=bar; Expires=baz');
      expect(cookie.expires).to.equal(Infinity);
      expect(cookie.input.expires).to.equal('baz');

      done();
    });

    it('parses full cookies', function (done) {
      var cookie = create('foo=bar;');
      expect(cookie).to.deep.equal({
        name: 'foo',
        value: 'bar',
        domain: null,
        path: null,
        secure: false,
        httpOnly: false,
        expires: Infinity,
        maxAge: Infinity,
        expiration: Infinity,
        input: {
          cookie: 'foo=bar;',
          name: 'foo',
          value: 'bar',
          domain: null,
          path: null,
          secure: null,
          httpOnly: null,
          expires: null,
          maxAge: null
        }
      });

      var date = 'Tue, 18 Oct 2016 07:05:03 GMT';
      cookie = create('foo= "bar!"; Expires=' + date + '; Path=/baz; Domain=google.com; Secure; HTTPOnly; Fizz=Buzz; Quxx');
      expect(cookie).to.deep.equal({
        name: 'foo',
        value: '"bar!"',
        domain: 'google.com',
        path: '/baz',
        secure: true,
        httpOnly: true,
        expires: Date.parse(date),
        maxAge: Infinity,
        expiration: Date.parse(date),
        input: {
          cookie: 'foo= "bar!"; Expires=' + date + '; Path=/baz; Domain=google.com; Secure; HTTPOnly; Fizz=Buzz; Quxx',
          name: 'foo',
          value: '"bar!"',
          domain: 'google.com',
          path: '/baz',
          secure: 'Secure',
          httpOnly: 'HTTPOnly',
          expires: date,
          maxAge: null
        }
      });

      cookie = create('JSESSIONID=C1FE28F6878DC215D9321837B7AFE974; Path=/');
      expect(cookie.name).to.equal('JSESSIONID');
      expect(cookie.value).to.equal('C1FE28F6878DC215D9321837B7AFE974');
      expect(cookie.path).to.equal('/');

      done();
    });

    it('handles empty values', function (done) {
      var cookie = create('');
      expect(cookie).to.deep.equal({
        name: '',
        value: null,
        domain: null,
        path: null,
        secure: false,
        httpOnly: false,
        expires: Infinity,
        maxAge: Infinity,
        expiration: Infinity,
        input: {
          cookie: '',
          name: '',
          value: null,
          domain: null,
          path: null,
          secure: null,
          httpOnly: null,
          expires: null,
          maxAge: null
        }
      });
      done();
    });

    it('handles extra semicolons', function (done) {
      var cookie = create('foo=bar;;; ; ; secure=false;; httpOnly=true;;;;;;; ');

      expect(cookie.secure).to.equal(true);
      expect(cookie.input.secure).to.equal('secure');
      expect(cookie.httpOnly).to.equal(true);
      expect(cookie.input.httpOnly).to.equal('httpOnly');
      done();
    });

    it('throws if input is not a string', function (done) {
      function fail (arg) {
        expect(function () {
          create(arg);
        }).to.throw(TypeError, 'Cookie constructor requires a string');
      }

      fail(undefined);
      fail(null);
      fail(true);
      fail(false);
      fail(0);
      fail(NaN);
      fail(1);
      fail(Infinity);
      fail({});
      done();
    });
  });

  describe('toRequestCookie()', function () {
    it('stringifies a cookie with a key and value', function (done) {
      var str = 'foo=bar; domain=google.com; path=/baz; expires=Sun, 20 Mar 2016 07:05:03 GMT; max-age=1234; secure; httponly';
      var cookie = create(str);

      expect(cookie.toRequestCookie()).to.equal('foo=bar');
      done();
    });

    it('stringifies a cookie with a key and value', function (done) {
      var str = 'foo; domain=google.com; path=/baz; expires=Sun, 20 Mar 2016 07:05:03 GMT; max-age=1234; secure; httponly';
      var cookie = create(str);

      expect(cookie.toRequestCookie()).to.equal('foo');
      done();
    });
  });

  describe('toString()', function () {
    it('stringifies all fields', function (done) {
      var str = 'foo=bar; domain=google.com; path=/baz; expires=Sun, 20 Mar 2016 07:05:03 GMT; max-age=1234; secure; httponly';
      var cookie = create(str);

      expect(cookie.toString()).to.equal(str);
      done();
    });

    it('stringifies a key with no value', function (done) {
      var str = 'foo';
      var cookie = create(str);

      expect(cookie.toString()).to.equal('foo; path=/');
      done();
    });

    it('encodes values', function (done) {
      var cookie = create('foo=a b c');

      expect(cookie.name).to.equal('foo');
      expect(cookie.value).to.equal('a b c');
      expect(cookie.toString()).to.equal('foo=a%20b%20c; path=/');
      done();
    });
  });
});
