import { assign, setup } from 'xstate';

const state = {
  card_entered: 'card_entered',
  card_waiting_for_card: 'card_waiting_for_card',
  card_waiting_for_pin: 'card_waiting_for_pin',
  card_waiting_for_removed: 'card_waiting_for_removed',
  app_done: 'app_done',
  manual_continue: 'manual_continue', // helper event to continue from one state to another while developing this state machine
};

export const machine = setup({
  types: {
    context: {} as { atm: { displayText: string }; debug: string },
    events: {} as
      | {
          type: 'event.card_insert';
        }
      | {
          type: 'event.manual_continue';
          displayText?: string | undefined;
        }
      | {
          type: 'event.unplug';
        },
  },
}).createMachine({
  id: 'bank',
  description: 'ATM simulation',

  // types: {} as {
  //   context: {
  //     atm: { display_text: string }
  //   }
  // },

  // context: ({ input }) => ({
  //   atm : input?.di ?? { display_text: 'Welcome, insert card'}
  // }),

  context: ({ input }) => ({
    atm: { displayText: 'Welcome, insert card' },
    debug: '',
  }),

  // States
  initial: state.card_waiting_for_card,
  states: {
    [state.card_waiting_for_card]: {
      description: 'description: waiting for a card to be entered',
      meta: 'meta: waiting for a card to be entered',
      tags: ['card'],
      on: {
        'event.card_insert': {
          target: [state.card_entered],
          actions: assign({
            atm: { displayText: 'Reading Card' },
          }),
        },
        'event.unplug': {
          target: [state.app_done],
        },
      },
    },
    [state.card_entered]: {
      description: 'description: card has been entered',
      meta: 'meta: card has been entered',
      tags: ['card'],
      on: {
        'event.manual_continue': {
          target: [state.card_waiting_for_pin],
          actions: assign({
            atm: (event) => {
              return { displayText: `Manual Continue ${state.card_entered}` };
            },
          }),
        },
        'event.unplug': {
          target: [state.app_done],
        },
      },
    },
    [state.card_waiting_for_pin]: {
      description: 'description: waiting for a pin for a card',
      meta: 'meta: waiting for a pin for a card',
      tags: ['card', 'pin'],
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
      on: {
        'event.manual_continue': {
          target: [state.app_done],
          actions: assign({
            atm: ({ event, context }) => {
              return {
                displayText: event?.displayText || context.atm.displayText,
              };
            },
          }),
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
          // console.log(event);
          // console.log(event?.displayText);

          if (event.type !== 'event.manual_continue') {
            return {
              displayText: 'event.manual_continue ended this machine',
            };
          }

          return {
            displayText:
              event.displayText || ` ${event.type} ended this machine`,
          };
        },
      }),
    },
  },
});
