import React from 'react';
import { machine } from './machine';

import useStateMachineDebugger from '../../hooks/useStateMachineDebugger';

export default function App() {
  const { state, actor, send } = useStateMachineDebugger(machine, {
    meta: 'test',
    ref: 'https://stately.ai/docs/cheatsheet',
  });

  return (
    <>
      <div className="state-key"></div>
      <p className="state-description">
        Only states. There’s no transitions which means the awake state cannot
        be reached.
      </p>
      <div></div>

      {state.matches('asleep') && (
        <div>
          <div className="state-key">asleep</div>
          <p className="state-description">
            <img src="https://raw.githubusercontent.com/statelyai/assets/main/example-images/dogs/asleep.svg" />
          </p>
          <div></div>
        </div>
      )}

      {state.matches('awake') && (
        <div>
          <div className="state-key">awake</div>
          <p className="state-description">
            <img src="https://raw.githubusercontent.com/statelyai/assets/main/example-images/dogs/walking.svg" />
          </p>
          <div></div>
        </div>
      )}
    </>
  );
}
