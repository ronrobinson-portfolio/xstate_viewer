import { delay, http, HttpResponse } from 'msw';

const cards = [
  {
    id: 1,
    number: 1234567890,
    account_name: 'Walter Bishop',
    pin: '1234',
  },
  {
    id: 2,
    number: 9987654321,
    account_name: 'Harley Quinn',
    pin: '2345',
  },
];

export default [
  http.get('/card/:id', async ({ params }) => {
    await delay(Math.random() * (3000 - 1500) + 1500);

    const { id } = params;
    const card = cards.find((card) => card.id === Number(id));

    return HttpResponse.json(card ?? { status: 404 });
  }),
  http.post('/card/validate/:id', async ({ request, params }) => {
    await delay(Math.random() * (3000 - 1500) + 1500);

    const payload: any = await request.json();
    const cardPin = payload.cardPin;

    const { id } = params;
    const card = cards.find((card) => card.id === Number(id));

    if (card && card.pin === cardPin) {
      return HttpResponse.json(card);
    } else {
      return new HttpResponse(null, {
        status: 401,
        statusText: 'Invalid Pin',
      });

      // return HttpResponse.json(null, {
      //   status: 401,
      //   statusText: 'Invalid Pin',
      // });
    }
  }),
];
