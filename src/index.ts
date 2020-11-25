import { endpoint } from 'tyfon-conventions';
import { fetch } from 'cross-fetch';


export class HttpError extends Error {
  constructor(readonly status: number, readonly message: string) {
    super(message);
  }
}


export type Req = RequestInit &{
  url: string;
  query?: {[key: string]: string};
}


function encodeQuery(q: {[key: string]: string}) {
  return Object.entries(q).map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&');
}


function request(req: Req) {
  if (req.query) return fetch(req.url + '?' + encodeQuery(req.query), req);
  else return fetch(req.url, req);
}


export async function invoke(origin: string, method: string, ...args: any[]) {
  const ep = endpoint(method);
  const req: Req = {
    method: ep.method,
    url: `${origin}/${ep.url}`,
  };

  if (req.method === 'GET' || req.method === 'DELETE') {
    req.query = req.query || {};
    args.forEach((arg, index) => req.query![index] = JSON.stringify(arg));
  } else {
    req.headers = req.headers || {};
    (req.headers as any)['Content-Type'] = 'application/json';
    req.body = JSON.stringify({ ...args });
  }

  const response = await request(req);
  if (response.status >= 400) {
    throw new HttpError(response.status, response.statusText);
  } else {
    return await response.json();
  }
}
