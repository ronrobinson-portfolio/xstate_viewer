import { delay, http, HttpResponse } from 'msw';

const cards = [
  {
    id: 1,
    number: 555666777,
    account_name: 'Walter Bishop',
    pin: '1234',
  },
  {
    id: 2,
    number: 555666777,
    account_name: 'Harley Quinn',
    pin: '1234',
  },
];

export default [
  http.get('/card/:id', async ({ params }) => {
    await delay(Math.random() * (3000 - 1500) + 1500);

    const { id } = params;
    const card = cards.find((card) => card.id === Number(id));

    return HttpResponse.json(card ?? { status: 404 });
  }),
];
