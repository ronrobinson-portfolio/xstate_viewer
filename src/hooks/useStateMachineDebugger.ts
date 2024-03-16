import { useOutletContext } from 'react-router-dom';
import OutletContextType from '../types/OutletContextType';
import { useMachine } from '@xstate/react';
import { useEffect } from 'react';
import { StateMachine } from 'xstate';

export default (
  machine: StateMachine<any, any, any, any, any, any, any, any, any, any, any>,
  metaInfo?: { meta: string; ref: string },
) => {
  const { setMeta, setMachine, setActor } =
    useOutletContext<OutletContextType>();
  const [state, send, actor] = useMachine(machine);

  useEffect(() => {
    setMeta(metaInfo ?? { meta: 'a state machine', ref: 'no reference' });
  }, []);

  useEffect(() => {
    console.log('debug: ', 'state change');
    setMachine(state);

    // Setting the actor does not trigger the actor use effect below, must be the same reference
    setActor(actor);
  }, [state]);

  // NOTE: Actor doesn't change when useMachine().state changes
  useEffect(() => {
    console.log('debug: ', actor.getSnapshot());
  }, [actor]);

  return { state, actor, send };
};
