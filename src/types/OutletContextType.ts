import React from 'react';
import { Actor, MachineSnapshot, StateMachine } from 'xstate';

type OutletContextType = {
  setMeta: React.Dispatch<
    React.SetStateAction<{ [index: string]: any } | null>
  >;
  setMachine: React.Dispatch<React.SetStateAction<
    MachineSnapshot<any, any, any, any, any, any>
  > | null>;
  setActor: React.Dispatch<React.SetStateAction<Actor<any>> | null>;
};

export default OutletContextType;
