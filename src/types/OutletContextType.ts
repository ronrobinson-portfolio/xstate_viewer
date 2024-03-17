import React from 'react';
import { Actor, ActorOptions, MachineSnapshot } from 'xstate';
import { StateMachine } from '../hooks/useStateMachineDebugger';

type OutletContextType = {
  setMeta: React.Dispatch<
    React.SetStateAction<{ [index: string]: any } | null>
  >;
  setMachine: React.Dispatch<React.SetStateAction<
    MachineSnapshot<any, any, any, any, any, any>
  > | null>;
  setActor: React.Dispatch<React.SetStateAction<Actor<any>> | null>;
  setResetActor: React.Dispatch<
    React.SetStateAction<
      | ((options?: ActorOptions<StateMachine> & {}) => Actor<StateMachine>)
      | null
    >
  >;
};

export default OutletContextType;
