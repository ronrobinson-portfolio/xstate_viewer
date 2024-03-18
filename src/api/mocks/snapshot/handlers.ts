import { http, HttpResponse } from 'msw';

// TODO: Use indexdb instead of localstorage
export default [
  http.get('/snapshot', () => {
    const snapshot = localStorage.getItem('snapshot');

    return HttpResponse.json({ snapshot });
  }),

  http.post('/snapshot', async ({ request }) => {
    const snapshot: any = await request.json();
    localStorage.setItem('snapshot', JSON.stringify(snapshot.snapshot));

    return HttpResponse.json({ result: 'success' });
  }),
];
