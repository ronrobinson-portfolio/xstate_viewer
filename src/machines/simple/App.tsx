import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { machine } from './machine';
import { useOutletContext } from 'react-router-dom';
import OutletContextType from '../../types/OutletContextType';
import useStateMachineDebugger from '../../hooks/useStateMachineDebugger';

export default function App() {
  const { state, actor, send } = useStateMachineDebugger(machine, {
    meta: 'increment example',
    ref: 'https://stately.ai/docs/cheatsheet',
  });

  return (
    <div className="App">
      <div>
        <div className="state-key"></div>

        <div>
          <button
            className="event-button"
            onClick={() => send({ type: 'INC' })}
          >
            INC
          </button>
          <button
            className="event-button"
            onClick={() => send({ type: 'DEC' })}
          >
            DEC
          </button>
          <button
            className="event-button"
            onClick={() =>
              send({
                type: 'SET',
                value:
                  +(
                    (
                      document.getElementById(
                        'set_value',
                      ) as HTMLInputElement | null
                    )?.value || 0
                  ) || 0,
              })
            }
          >
            SET
          </button>
          <input id="set_value" />
        </div>

        <pre>{JSON.stringify(state.context, null, 2)}</pre>
      </div>
    </div>
  );
}
