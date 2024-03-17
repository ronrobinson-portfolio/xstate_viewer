import { http, HttpResponse } from 'msw';

export default [
  http.get('/pet', () => {
    return HttpResponse.json(['Tom', 'Jerry', 'Spike']);
  }),
];
