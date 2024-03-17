import { http, HttpResponse } from 'msw';

export default [
  http.get('/snapshot', () => {
    return HttpResponse.json(['Tom', 'Jerry', 'Spike']);
  }),
];
