import { assign, fromPromise, setup } from 'xstate';
import axios from 'axios';

const state = {
  card_entered: 'card_entered',
  card_waiting_for_card: 'card_waiting_for_card',
  card_waiting_for_pin: 'card_waiting_for_pin',
  card_waiting_for_removed: 'card_waiting_for_removed',
  account_fetch: 'account_fetch',
  app_done: 'app_done',
  manual_continue: 'manual_continue', // helper event to continue from one state to another while developing this state machine
};

const fetchCard = (cardId: number) => {
  return axios.get(`/card/${cardId}`);
};

export const machine = setup({
  types: {
    context: {} as {
      atm: { displayText: string };
      card: {
        id: number;
        number: number;
        account_name: string;
        pin: string;
      } | null;
      debug?: string;
    },
    events: {} as
      | {
          type: 'event.card_insert';
          payload: { cardId: number };
        }
      | {
          type: 'event.manual_continue';
          displayText?: string | undefined;
        }
      | {
          type: 'event.unplug';
        },
    input: {} as {
      initialMessage: string;
    },
  },
  actors: {
    fetchCard: fromPromise(async ({ input }: { input: { cardId: number } }) => {
      console.log(input);
      return await fetchCard(input?.cardId);
    }),
  },
}).createMachine({
  id: 'bank',
  description: 'ATM simulation',
  context: ({ input }) => ({
    atm: { displayText: input?.initialMessage ?? 'Please enter your card' },
    card: null,
  }),

  // context: ({ input }) => ({
  //   atm: { displayText: 'Welcome, insert card' },
  //   debug: '',
  // }),

  // TODO: How to use lazy init context and Input with typescript
  // https://stately.ai/docs/context#lazy-initial-context
  // https://stately.ai/docs/context#input
  // types: {} as {
  //   context: {
  //     atm: { display_text: string }
  //   }
  // },
  // context: ({ input }) => ({
  //   atm : input?.di ?? { display_text: 'Welcome, insert card'}
  // }),

  // States
  initial: state.card_waiting_for_card,
  states: {
    [state.card_waiting_for_card]: {
      description: 'description: waiting for a card to be entered',
      meta: 'meta: waiting for a card to be entered',
      tags: ['card'],
      on: {
        'event.card_insert': {
          target: [state.account_fetch],
          actions: assign(({ context, event }) => ({
            card: {
              id: event.payload.cardId,
              number: 0,
              account_name: '', // move to account
              pin: '', // move to account
            },
          })),
        },
      },
    },
    [state.account_fetch]: {
      entry: assign(() => ({
        atm: { displayText: 'Reading Card' },
      })),
      invoke: {
        src: 'fetchCard',
        input: ({ context }) => ({ cardId: context?.card?.id ?? 1 }), // TODO: Handle card if null
        onDone: {
          target: [state.card_waiting_for_pin],
          actions: assign({
            card: ({ event }) => {
              console.log(event.output.data);
              return {
                id: event.output.data.id,
                number: event.output.data.number,
                account_name: event.output.data.account_name,
                pin: event.output.data.pin,
              };
            },
          }),
        },
        onError: {
          target: [state.card_waiting_for_pin], // TODO: Create failure state
          //actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    // [state.card_entered]: {
    //   description: 'description: card has been entered',
    //   meta: 'meta: card has been entered',
    //   tags: ['card'],
    //   on: {
    //     'event.manual_continue': {
    //       target: [state.card_waiting_for_pin],
    //       actions: assign({
    //         atm: () => {
    //           return { displayText: `Manual Continue ${state.card_entered}` };
    //         },
    //       }),
    //     },
    //   },
    // },
    [state.card_waiting_for_pin]: {
      description: 'description: waiting for a pin for a card',
      meta: 'meta: waiting for a pin for a card',
      tags: ['card', 'pin'],
      entry: assign(({ context, event }) => ({
        atm: { displayText: 'Waiting for pin' },
      })),
      on: {
        'event.manual_continue': {
          target: [state.card_waiting_for_removed],
          actions: assign({
            atm: (actionEvent) => {
              const { event, context } = actionEvent;
              return {
                displayText: event?.displayText || context.atm.displayText,
              };
            },
          }),
        },
      },
    },
    [state.card_waiting_for_removed]: {
      description: 'description: waiting for a card to be removed',
      meta: 'meta: waiting for a card to be removed',
      tags: ['card'],
      entry: assign(({ context, event }) => ({
        atm: { displayText: 'Waiting for card to be removed' },
      })),
      on: {
        'event.manual_continue': {
          target: [state.app_done],
          // actions: assign({
          //   atm: ({ event, context }) => {
          //     return {
          //       displayText: event?.displayText || context.atm.displayText,
          //     };
          //   },
          // }),
        },
      },
    },
    [state.app_done]: {
      description: 'description: done',
      meta: 'meta: done',
      tags: ['final'],
      type: 'final',
      entry: assign({
        atm: ({ event }) => {
          if (event.type !== 'event.manual_continue') {
            return {
              displayText: ` ${event.type} ended this machine`,
            };
          }

          return {
            displayText: 'event.manual_continue ended this machine',
          };
        },
      }),
    },
  },
  on: {
    'event.unplug': {
      target: '.' + [state.app_done],
    },
  },
  output: ({ context }) => ({
    finalMessage: 'The credit card transition has ended',
    finalContext: context,
  }),
});
