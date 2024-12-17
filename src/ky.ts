// @ts-nocheck
/* eslint-disable */
/**
 * Bundled by jsDelivr using Rollup v2.79.2 and Terser v5.37.0.
 * Original file: /npm/ky@1.7.3/distribution/index.js
 * De-esm-ified by Rowan
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
class HTTPError extends Error {
  response;
  request;
  options;
  constructor(t, e, s) {
    const o = `${t.status || 0 === t.status ? t.status : ""} ${
      t.statusText || ""
    }`.trim();
    super(
      `Request failed with ${o ? `status code ${o}` : "an unknown error"}: ${
        e.method
      } ${e.url}`
    ),
      (this.name = "HTTPError"),
      (this.response = t),
      (this.request = e),
      (this.options = s);
  }
}
class TimeoutError extends Error {
  request;
  constructor(t) {
    super(`Request timed out: ${t.method} ${t.url}`),
      (this.name = "TimeoutError"),
      (this.request = t);
  }
}
(function (){
const s = (t) => null !== t && "object" == typeof t,
  o = (...t) => {
    for (const e of t)
      if ((!s(e) || Array.isArray(e)) && void 0 !== e)
        throw new TypeError("The `options` argument must be an object");
    return a({}, ...t);
  },
  r = (t = {}, e = {}) => {
    const s = new globalThis.Headers(t),
      o = e instanceof globalThis.Headers,
      r = new globalThis.Headers(e);
    for (const [t, e] of r.entries())
      (o && "undefined" === e) || void 0 === e ? s.delete(t) : s.set(t, e);
    return s;
  };
function n(t, e, s) {
  return Object.hasOwn(e, s) && void 0 === e[s]
    ? []
    : a(t[s] ?? [], e[s] ?? []);
}
const i = (t = {}, e = {}) => ({
    beforeRequest: n(t, e, "beforeRequest"),
    beforeRetry: n(t, e, "beforeRetry"),
    afterResponse: n(t, e, "afterResponse"),
    beforeError: n(t, e, "beforeError"),
  }),
  a = (...t) => {
    let e = {},
      o = {},
      n = {};
    for (const h of t)
      if (Array.isArray(h)) Array.isArray(e) || (e = []), (e = [...e, ...h]);
      else if (s(h)) {
        for (let [t, o] of Object.entries(h))
          s(o) && t in e && (o = a(e[t], o)), (e = { ...e, [t]: o });
        s(h.hooks) && ((n = i(n, h.hooks)), (e.hooks = n)),
          s(h.headers) && ((o = r(o, h.headers)), (e.headers = o));
      }
    return e;
  },
  h = (() => {
    let t = !1,
      e = !1;
    const s = "function" == typeof globalThis.ReadableStream,
      o = "function" == typeof globalThis.Request;
    if (s && o)
      try {
        e = new globalThis.Request("https://empty.invalid", {
          body: new globalThis.ReadableStream(),
          method: "POST",
          get duplex() {
            return (t = !0), "half";
          },
        }).headers.has("Content-Type");
      } catch (t) {
        if (t instanceof Error && "unsupported BodyInit type" === t.message)
          return !1;
        throw t;
      }
    return t && !e;
  })(),
  u = "function" == typeof globalThis.AbortController,
  p = "function" == typeof globalThis.ReadableStream,
  c = "function" == typeof globalThis.FormData,
  l = ["get", "post", "put", "patch", "head", "delete"],
  f = {
    json: "application/json",
    text: "text/*",
    formData: "multipart/form-data",
    arrayBuffer: "*/*",
    blob: "*/*",
  },
  d = 2147483647,
  y = Symbol("stop"),
  m = {
    json: !0,
    parseJson: !0,
    stringifyJson: !0,
    searchParams: !0,
    prefixUrl: !0,
    retry: !0,
    timeout: !0,
    hooks: !0,
    throwHttpErrors: !0,
    onDownloadProgress: !0,
    fetch: !0,
  },
  _ = {
    method: !0,
    headers: !0,
    body: !0,
    mode: !0,
    credentials: !0,
    cache: !0,
    redirect: !0,
    referrer: !0,
    referrerPolicy: !0,
    integrity: !0,
    keepalive: !0,
    signal: !0,
    window: !0,
    dispatcher: !0,
    duplex: !0,
    priority: !0,
  },
  b = (t) => (l.includes(t) ? t.toUpperCase() : t),
  w = {
    limit: 2,
    methods: ["get", "put", "head", "delete", "options", "trace"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
    afterStatusCodes: [413, 429, 503],
    maxRetryAfter: Number.POSITIVE_INFINITY,
    backoffLimit: Number.POSITIVE_INFINITY,
    delay: (t) => 0.3 * 2 ** (t - 1) * 1e3,
  },
  g = (t = {}) => {
    if ("number" == typeof t) return { ...w, limit: t };
    if (t.methods && !Array.isArray(t.methods))
      throw new Error("retry.methods must be an array");
    if (t.statusCodes && !Array.isArray(t.statusCodes))
      throw new Error("retry.statusCodes must be an array");
    return { ...w, ...t };
  };
class R {
  static create(e, s) {
    const o = new R(e, s),
      r = async () => {
        if ("number" == typeof o._options.timeout && o._options.timeout > d)
          throw new RangeError(
            "The `timeout` option cannot be greater than 2147483647"
          );
        await Promise.resolve();
        let e = await o._fetch();
        for (const t of o._options.hooks.afterResponse) {
          const s = await t(
            o.request,
            o._options,
            o._decorateResponse(e.clone())
          );
          s instanceof globalThis.Response && (e = s);
        }
        if ((o._decorateResponse(e), !e.ok && o._options.throwHttpErrors)) {
          let s = new t(e, o.request, o._options);
          for (const t of o._options.hooks.beforeError) s = await t(s);
          throw s;
        }
        if (o._options.onDownloadProgress) {
          if ("function" != typeof o._options.onDownloadProgress)
            throw new TypeError(
              "The `onDownloadProgress` option must be a function"
            );
          if (!p)
            throw new Error(
              "Streams are not supported in your environment. `ReadableStream` is missing."
            );
          return o._stream(e.clone(), o._options.onDownloadProgress);
        }
        return e;
      },
      n = o._options.retry.methods.includes(o.request.method.toLowerCase())
        ? o._retry(r)
        : r();
    for (const [t, e] of Object.entries(f))
      n[t] = async () => {
        o.request.headers.set("accept", o.request.headers.get("accept") || e);
        const r = await n;
        if ("json" === t) {
          if (204 === r.status) return "";
          if (0 === (await r.clone().arrayBuffer()).byteLength) return "";
          if (s.parseJson) return s.parseJson(await r.text());
        }
        return r[t]();
      };
    return n;
  }
  request;
  abortController;
  _retryCount = 0;
  _input;
  _options;
  constructor(t, e = {}) {
    if (
      ((this._input = t),
      (this._options = {
        ...e,
        headers: r(this._input.headers, e.headers),
        hooks: i(
          {
            beforeRequest: [],
            beforeRetry: [],
            beforeError: [],
            afterResponse: [],
          },
          e.hooks
        ),
        method: b(e.method ?? this._input.method),
        prefixUrl: String(e.prefixUrl || ""),
        retry: g(e.retry),
        throwHttpErrors: !1 !== e.throwHttpErrors,
        timeout: e.timeout ?? 1e4,
        fetch: e.fetch ?? globalThis.fetch.bind(globalThis),
      }),
      "string" != typeof this._input &&
        !(
          this._input instanceof URL ||
          this._input instanceof globalThis.Request
        ))
    )
      throw new TypeError("`input` must be a string, URL, or Request");
    if (this._options.prefixUrl && "string" == typeof this._input) {
      if (this._input.startsWith("/"))
        throw new Error(
          "`input` must not begin with a slash when using `prefixUrl`"
        );
      this._options.prefixUrl.endsWith("/") || (this._options.prefixUrl += "/"),
        (this._input = this._options.prefixUrl + this._input);
    }
    if (u) {
      this.abortController = new globalThis.AbortController();
      const t = this._options.signal ?? this._input.signal;
      t?.addEventListener("abort", () => {
        this.abortController.abort(t.reason);
      }),
        (this._options.signal = this.abortController.signal);
    }
    if (
      (h && (this._options.duplex = "half"),
      void 0 !== this._options.json &&
        ((this._options.body =
          this._options.stringifyJson?.(this._options.json) ??
          JSON.stringify(this._options.json)),
        this._options.headers.set(
          "content-type",
          this._options.headers.get("content-type") ?? "application/json"
        )),
      (this.request = new globalThis.Request(this._input, this._options)),
      this._options.searchParams)
    ) {
      const t =
          "?" +
          ("string" == typeof this._options.searchParams
            ? this._options.searchParams.replace(/^\?/, "")
            : new URLSearchParams(this._options.searchParams).toString()),
        e = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, t);
      !(
        (c && this._options.body instanceof globalThis.FormData) ||
        this._options.body instanceof URLSearchParams
      ) ||
        (this._options.headers && this._options.headers["content-type"]) ||
        this.request.headers.delete("content-type"),
        (this.request = new globalThis.Request(
          new globalThis.Request(e, { ...this.request }),
          this._options
        ));
    }
  }
  _calculateRetryDelay(s) {
    if (
      (this._retryCount++,
      this._retryCount > this._options.retry.limit || s instanceof e)
    )
      throw s;
    if (s instanceof t) {
      if (!this._options.retry.statusCodes.includes(s.response.status)) throw s;
      const t =
        s.response.headers.get("Retry-After") ??
        s.response.headers.get("RateLimit-Reset") ??
        s.response.headers.get("X-RateLimit-Reset") ??
        s.response.headers.get("X-Rate-Limit-Reset");
      if (
        t &&
        this._options.retry.afterStatusCodes.includes(s.response.status)
      ) {
        let e = 1e3 * Number(t);
        Number.isNaN(e)
          ? (e = Date.parse(t) - Date.now())
          : e >= Date.parse("2024-01-01") && (e -= Date.now());
        const s = this._options.retry.maxRetryAfter ?? e;
        return e < s ? e : s;
      }
      if (413 === s.response.status) throw s;
    }
    const o = this._options.retry.delay(this._retryCount);
    return Math.min(this._options.retry.backoffLimit, o);
  }
  _decorateResponse(t) {
    return (
      this._options.parseJson &&
        (t.json = async () => this._options.parseJson(await t.text())),
      t
    );
  }
  async _retry(t) {
    try {
      return await t();
    } catch (e) {
      const s = Math.min(this._calculateRetryDelay(e), d);
      if (this._retryCount < 1) throw e;
      await (async function (t, { signal: e }) {
        return new Promise((s, o) => {
          function r() {
            clearTimeout(n), o(e.reason);
          }
          e &&
            (e.throwIfAborted(), e.addEventListener("abort", r, { once: !0 }));
          const n = setTimeout(() => {
            e?.removeEventListener("abort", r), s();
          }, t);
        });
      })(s, { signal: this._options.signal });
      for (const t of this._options.hooks.beforeRetry) {
        if (
          (await t({
            request: this.request,
            options: this._options,
            error: e,
            retryCount: this._retryCount,
          })) === y
        )
          return;
      }
      return this._retry(t);
    }
  }
  async _fetch() {
    for (const t of this._options.hooks.beforeRequest) {
      const e = await t(this.request, this._options);
      if (e instanceof Request) {
        this.request = e;
        break;
      }
      if (e instanceof Response) return e;
    }
    const t = ((t, e) => {
        const s = {};
        for (const o in e) o in _ || o in m || o in t || (s[o] = e[o]);
        return s;
      })(this.request, this._options),
      s = this.request;
    return (
      (this.request = s.clone()),
      !1 === this._options.timeout
        ? this._options.fetch(s, t)
        : (async function (t, s, o, r) {
            return new Promise((n, i) => {
              const a = setTimeout(() => {
                o && o.abort(), i(new e(t));
              }, r.timeout);
              r.fetch(t, s)
                .then(n)
                .catch(i)
                .then(() => {
                  clearTimeout(a);
                });
            });
          })(s, t, this.abortController, this._options)
    );
  }
  _stream(t, e) {
    const s = Number(t.headers.get("content-length")) || 0;
    let o = 0;
    return 204 === t.status
      ? (e &&
          e(
            { percent: 1, totalBytes: s, transferredBytes: o },
            new Uint8Array()
          ),
        new globalThis.Response(null, {
          status: t.status,
          statusText: t.statusText,
          headers: t.headers,
        }))
      : new globalThis.Response(
          new globalThis.ReadableStream({
            async start(r) {
              const n = t.body.getReader();
              e &&
                e(
                  { percent: 0, transferredBytes: 0, totalBytes: s },
                  new Uint8Array()
                ),
                await (async function t() {
                  const { done: i, value: a } = await n.read();
                  if (i) r.close();
                  else {
                    if (e) {
                      o += a.byteLength;
                      e(
                        {
                          percent: 0 === s ? 0 : o / s,
                          transferredBytes: o,
                          totalBytes: s,
                        },
                        a
                      );
                    }
                    r.enqueue(a), await t();
                  }
                })();
            },
          }),
          { status: t.status, statusText: t.statusText, headers: t.headers }
        );
  }
}
/*! MIT License © Sindre Sorhus */ const T = (t) => {
    const e = (e, s) => R.create(e, o(t, s));
    for (const s of l) e[s] = (e, r) => R.create(e, o(t, r, { method: s }));
    return (
      (e.create = (t) => T(o(t))),
      (e.extend = (e) => (
        "function" == typeof e && (e = e(t ?? {})), T(o(t, e))
      )),
      (e.stop = y),
      e
    );
  },
  q = T();
  window.ky = q;
})();
