import React from 'react';
import { machine } from './machine';
import useStateMachineDebugger from '../../hooks/useStateMachineDebugger';

export default function App() {
  const { state, actor, send } = useStateMachineDebugger(machine, {
    meta: 'example',
    ref: 'unknown',
  });

  console.log({ state, actor, send });

  return <div>no ui</div>;
}
