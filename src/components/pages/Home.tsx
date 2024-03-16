import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import OutletContextType from '../../types/OutletContextType';
import { useMachine } from '@xstate/react';
import { machine } from '../../machines/simple/machine';

export default function Home() {
  const { setMeta, setMachine } = useOutletContext<OutletContextType>();
  const [state, send] = useMachine(machine);

  useEffect(() => {
    setMeta(null);
  }, []);

  useEffect(() => {
    setMachine(null);
  }, [state]);

  return <div>Select a machine</div>;
}
