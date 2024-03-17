import { useOutletContext } from 'react-router-dom';
import OutletContextType from '../types/OutletContextType';
import { useMachine } from '@xstate/react';
import { useEffect, useState } from 'react';
import {
  Actor,
  ActorOptions,
  AnyActorLogic,
  createActor,
  StateMachine as XStateMachine,
} from 'xstate';
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

interface MetaInfo {
  meta: string;
  ref: string;
}

type StateMachineDebuggerParams =
  | {
      machine: StateMachine;
      actorOptions?: ActorOptions<any>;
      metaInfo?: MetaInfo;
    }
  | StateMachine;

// Returning object
interface StateMachineDebugger {
  state: any;
  actor: Actor<any>;
  send: (event: AnyEventObject) => void;
  resetActor: (
    options?: ActorOptions<StateMachine> & {},
  ) => Actor<StateMachine>;
}

function initializeParams(
  params:
    | {
        machine: StateMachine;
        actorOptions?: ActorOptions<any>;
        metaInfo?: MetaInfo;
      }
    | StateMachine,
  _metaInfo?: { meta: string; ref: string },
) {
  let machine: StateMachine;
  let actorOptions: ActorOptions<any> | undefined;
  let metaInfo: MetaInfo | undefined;

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
const useStateMachineDebugger = (
  params: StateMachineDebuggerParams,
  _metaInfo?: MetaInfo,
): StateMachineDebugger => {
  const { machine, actorOptions, metaInfo } = initializeParams(
    params,
    _metaInfo,
  );
  const { setMeta, setMachine, setActor } =
    useOutletContext<OutletContextType>();

  // Current state machine snapshot & actor
  const [stateMachineSnapshot, setStateMachineSnapshot] = useState<any>(null);
  const [stateMachineActor, setStateMachineActor] = useState<any>(null);
  const [stateMachineSend, setStateMachineSend] = useState<any>(null);

  // useMachine option (second param) are the same options for an actor when using createActor()
  const [state, send, actor] = useMachine(machine, actorOptions);

  // useMachine() changes
  useEffect(() => {
    console.log('debug: ', 'state ref change');
    setMachine(state);
    setActor(actor);

    // Local to useStateMachineDebugger
    setStateMachineSnapshot(state);
    setStateMachineActor(actor);
    setStateMachineSend(() => send);

    // Call to context
    setMachine(state);
    setActor(actor);
  }, [state, actor]);

  // useMachine() changes
  // NOTE: Actor doesn't change when useMachine().state changes
  useEffect(() => {
    console.log('debug: ', 'actor ref changed');
  }, [actor]);

  // User meta info
  useEffect(() => {
    setMeta(metaInfo ?? { meta: 'a state machine', ref: 'no reference' });
  }, []);

  // replaces useMachine() [state, send, actor]
  const resetActor = (
    options?: ActorOptions<StateMachine> & {},
  ): Actor<StateMachine> => {
    const actor = createActor(machine, options);

    // Local to useStateMachineDebugger
    setStateMachineSnapshot(actor.getSnapshot());
    setStateMachineActor(actor);
    setStateMachineSend(actor.send);

    // Call to context
    setMachine(state);
    setActor(actor);

    return actor;
  };

  return {
    state: stateMachineSnapshot || state,
    actor: stateMachineActor || actor,
    send,
    resetActor,
  };
};

export default useStateMachineDebugger;
