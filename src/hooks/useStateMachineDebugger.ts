import { useOutletContext } from 'react-router-dom';
import OutletContextType from '../types/OutletContextType';
import { useMachine } from '@xstate/react';
import { useEffect } from 'react';
import { Actor, ActorOptions, StateMachine as XStateMachine } from 'xstate';
import { AnyEventObject } from 'xstate/dist/declarations/src/types';

type StateMachine = XStateMachine<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

function initializeParams(
  params:
    | {
        machine: StateMachine;
        actorOptions?: ActorOptions<any>;
        metaInfo?: { meta: string; ref: string };
      }
    | StateMachine,
  _metaInfo?: { meta: string; ref: string },
) {
  let machine: StateMachine;
  let actorOptions: ActorOptions<any> | undefined;
  let metaInfo: { meta: string; ref: string } | undefined;

  if ('machine' in params) {
    machine = params.machine;
    actorOptions = params.actorOptions;
    metaInfo = params.metaInfo;
  } else {
    machine = params;
    metaInfo = _metaInfo;
  }

  return { machine, actorOptions, metaInfo };
}

/*
 * Usage: useStateMachine({machine, actor, metaInfo})
 * Deprecated Usage: useStateMachine(machine, metaInfo})
 */
export default (
  params:
    | {
        machine: StateMachine;
        actorOptions?: ActorOptions<any>;
        metaInfo?: { meta: string; ref: string };
      }
    | StateMachine,
  _metaInfo?: { meta: string; ref: string },
): { state: any; actor: Actor<any>; send: (event: AnyEventObject) => void } => {
  const { machine, actorOptions, metaInfo } = initializeParams(
    params,
    _metaInfo,
  );
  const { setMeta, setMachine, setActor } =
    useOutletContext<OutletContextType>();

  // useMachine option (second param) are the same options for an actor when using createActor()
  const [state, send, actor] = useMachine(machine, actorOptions);

  useEffect(() => {
    setMeta(metaInfo ?? { meta: 'a state machine', ref: 'no reference' });
  }, []);

  useEffect(() => {
    console.log('debug: ', 'state ref change');
    setMachine(state);
    setActor(actor);
  }, [state, actor]);

  // NOTE: Actor doesn't change when useMachine().state changes
  useEffect(() => {
    console.log('debug: ', 'actor ref changed');
  }, [actor]);

  return { state, actor, send };
};
