import { and, assign, fromPromise, setup } from 'xstate';
import axios from 'axios';

const state = {
  // Card
  card_entered: 'card_entered',
  card_waiting_for_card: 'card_waiting_for_card',
  card_waiting_for_pin: 'card_waiting_for_pin',
  card_waiting_for_removed: 'card_waiting_for_removed',

  // Pin
  pinpad_accept_input: 'pinpad_accept_input',
  pinpad_button_press: 'pinpad_button_press',
  pinpad_validating: 'pinpad_validating',
  pinpad_invalid_pin: 'pinpad_invalid_pin',

  // Account
  account_fetch: 'account_fetch',

  // Other
  app_done: 'app_done',
  manual_continue: 'manual_continue', // helper event to continue from one state to another while developing this state machine
};

const fetchCard = (cardId: number) => {
  return axios.get(`/card/${cardId}`);
};

const validateCardPin = (cardId: number, payload: any) => {
  return axios.post(`/card/validate/${cardId}`, payload);
};

export const machine = setup({
  types: {
    context: {} as {
      atm: { displayText: string };
      entered_pin: string;
      pin_error: string;
      card: {
        id: number;
        number: number;
      } | null;
      account: {
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
        }
      | {
          type: 'event.pinpad_button_press';
          payload: { button: string | number };
        },
    input: {} as {
      initialMessage: string;
    },
  },
  actors: {
    fetchCard: fromPromise(async ({ input }: { input: { cardId: number } }) => {
      return await fetchCard(input?.cardId);
    }),
    validateCardPin: fromPromise(
      async ({ input }: { input: { cardId: number; cardPin: string } }) => {
        return await validateCardPin(input?.cardId, { cardPin: input.cardPin });
      },
    ),
  },
  guards: {
    isDeleteButton: ({ event }) => {
      return (
        event.type === 'event.pinpad_button_press' &&
        event.payload.button === 'delete'
      );
    },
    isEnterButton: ({ event }) => {
      return (
        event.type === 'event.pinpad_button_press' &&
        event.payload.button === 'enter'
      );
    },
    isPinValid: ({ context }) => {
      return context.entered_pin.length === 4;
    },
    canAppendToPin: ({ context, event }) => {
      if (event.type !== 'event.pinpad_button_press') {
        return false;
      }

      const button = event.payload.button;
      const isValidNumber =
        (typeof button === 'string' || typeof button === 'number') &&
        !isNaN(Number(button));

      return isValidNumber && context.entered_pin.length < 4;
    },
  },
}).createMachine({
  id: 'bank',
  description: 'ATM simulation',
  context: ({ input }) => ({
    atm: { displayText: input?.initialMessage ?? 'Please enter your card' },
    entered_pin: '',
    pin_error: '',
    card: null,
    account: null,
  }),

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
      meta: 'p:{"event.card_insert":["cardId"]}',
      tags: [''],
      on: {
        'event.card_insert': {
          target: [state.account_fetch],
          actions: assign(({ event }) => ({
            card: {
              id: event.payload.cardId,
              number: event.payload.cardId,
            },
          })),
        },
      },
    },
    [state.account_fetch]: {
      tags: ['card', 'loading'],
      entry: assign(() => ({
        atm: { displayText: 'Reading Card' },
      })),
      invoke: {
        src: 'fetchCard',
        input: ({ context }) => ({ cardId: context?.card?.id ?? 1 }), // TODO: Handle card if null
        onDone: {
          target: [state.card_waiting_for_pin],
          actions: assign({
            account: ({ event }) => {
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
        },
      },
    },
    [state.card_waiting_for_pin]: {
      tags: ['card', 'pin'],
      description: 'description: waiting for card pin',
      meta: 'p:{"event.pinpad_button_press":["button"]}',
      entry: assign(() => ({
        atm: { displayText: 'Waiting for pin' },
      })),
      initial: state.pinpad_accept_input,
      states: {
        [state.pinpad_accept_input]: {
          on: {
            'event.pinpad_button_press': [
              {
                guard: { type: 'isDeleteButton' },
                actions: assign(({ context }) => {
                  return {
                    entered_pin: context.entered_pin.slice(0, -1),
                  };
                }),
              },
              {
                guard: and([{ type: 'isEnterButton' }, { type: 'isPinValid' }]),
                target: [state.pinpad_validating], // Stupid? exit child to parent, is there a better way than using '#' symbol which is the id of the next state
              },
              {
                guard: { type: 'canAppendToPin' },
                actions: assign(({ context, event }) => {
                  return {
                    entered_pin: context.entered_pin + event.payload.button,
                  };
                }),
              },
            ],
          },
        },
        [state.pinpad_validating]: {
          tags: ['card', 'loading'],
          invoke: {
            src: 'validateCardPin',
            input: ({ context }) => {
              return {
                cardId: context?.card?.id ?? 1,
                cardPin: context.entered_pin,
              };
            },
            onDone: [
              {
                target: ['#' + state.card_waiting_for_removed],
                actions: assign({
                  card: ({ event }) => {
                    return {
                      id: event.output.data.id,
                      number: event.output.data.number,
                      account_name: event.output.data.account_name,
                      pin: event.output.data.pin,
                    };
                  },
                }),
              },
            ],
            onError: [
              {
                target: state.pinpad_invalid_pin,
                actions: assign({
                  pin_error: ({ event }: any) => {
                    return event.error.response.statusText;
                  },
                }),
              },
            ],
          },
        },
        [state.pinpad_invalid_pin]: {
          tags: ['card', 'error'],
          after: {
            2000: { target: state.pinpad_accept_input },
          },
          exit: assign(() => ({
            pin_error: '',
          })),
        },
      },
    },
    [state.card_waiting_for_removed]: {
      id: state.card_waiting_for_removed,
      description: 'description: waiting for a card to be removed',
      meta: 'meta: waiting for a card to be removed',
      tags: ['card'],
      entry: assign(() => ({
        atm: { displayText: 'Waiting for card to be removed' },
      })),
      on: {
        'event.manual_continue': {
          target: [state.app_done],
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
