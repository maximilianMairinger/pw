import { encode, decode } from "circ-msgpack"
import { Data } from "josm"
import { josmLocalStorageReflection } from "josm-adapter"
import { CancelAblePromise } from "more-proms"


export const sessionToken = josmLocalStorageReflection("sessionToken", "")


const http = location.hostname === "127.0.0.1" || location.hostname === "localhost" ? "http://" : "https://"

export const config = {
  addSessionTokenToBody: true,
  sessionTokenKeyInBody: "sessionToken",
  sessionToken: sessionToken,
  urlsWhereToAddSessionToken: [new URL(http + location.host)],
}


type HTTPMethods = "GET" | "POST" | "PUT" | "DELETE"

export function request(method: HTTPMethods, url: string | URL, body?: any) {
  return new CancelAblePromise((resolve) => {
    const abortController = new AbortController()
    const myUrl = url instanceof URL ? url : new URL(url.startsWith("http://") || url.startsWith("https://") ? url : http + location.host + (url.startsWith("/") ? "" : "/") + url)
    if (config.addSessionTokenToBody && config.urlsWhereToAddSessionToken.some((okUrl) => {
      return okUrl.protocol === myUrl.protocol && okUrl.host === myUrl.host && myUrl.pathname.startsWith(okUrl.pathname)
    }) && typeof body === "object" && body !== null && !(config.sessionTokenKeyInBody in body)) {
      body[config.sessionTokenKeyInBody] = config.sessionToken instanceof Data ? config.sessionToken.get() : config.sessionToken
    }
    const reqOb = {
      method: method,
      signal: abortController.signal,
      headers: {
        "Content-Type": "application/msgpack",
        "Accept": "application/msgpack",
      }
    } as RequestInit

    if (body !== undefined) reqOb.body = encode(body)
    
    resolve(fetch(url, reqOb).then(async res => {
      if (res.status !== 200) throw new Error("Server responded with status " + res.status)
      const arBuf = await res.arrayBuffer()
      return decode(new Uint8Array(arBuf))
    }))

    return (reason: any) => {
      abortController.abort(reason)
    }
  })
}

export function get(url: string | URL) {
  return request("GET", url)
}

export function post(url: string | URL, body: any) {
  return request("POST", url, body)
}

export function put(url: string | URL, body: any) {
  return request("PUT", url, body)
}

export function del(url: string | URL) {
  return request("DELETE", url)
}