import { Button } from 'react-bootstrap';
import React, { useCallback, useState } from 'react';
import { Actor, ActorOptions, MachineSnapshot } from 'xstate';
import { StateMachine } from '../../hooks/useStateMachineDebugger';
import StackedToast, { ToastMessage } from '../../components/ui/StackedToast';

interface MachineSnapshots {
  machine: MachineSnapshot<any, any, any, any, any, any> | null;
  actorState: Actor<any> | null;
  actorSnapshot: any;
  meta: { [index: string]: any };
  resetActor: (
    options?: ActorOptions<StateMachine> & {},
  ) => Actor<StateMachine>;
}

// https://stately.ai/docs/persistence
export default ({
  machine,
  actorState,
  actorSnapshot,
  meta,
  resetActor,
}: MachineSnapshots) => {
  const [showA, setShowA] = useState(true);
  const toggleShowA = () => setShowA(!showA);

  const [toastMessage, setToastMessage] = useState<
    string | ToastMessage | null
  >(null);

  const sendToastMessage = useCallback((message: string | ToastMessage) => {
    setToastMessage(message);
    // Reset after sending to allow for duplicate messages in a row
    setTimeout(() => setToastMessage(null), 100);
  }, []);

  const saveSnapshot = () => {
    if (!actorSnapshot) {
      sendToastMessage({ message: 'No snapshot provided', type: 'danger' });
      return;
    }

    localStorage.setItem('test', JSON.stringify(actorSnapshot));
    sendToastMessage('Snapshot saved');
  };

  const loadSnapshot = () => {
    const jsonSnapshot = localStorage.getItem('test');

    if (!jsonSnapshot) {
      sendToastMessage({ message: 'Error loading snapshot', type: 'danger' });
      return;
    }

    resetActor({ snapshot: JSON.parse(jsonSnapshot) });
    sendToastMessage('Snapshot loaded');
  };

  return (
    <>
      <Button onClick={saveSnapshot}>Save</Button>
      <Button onClick={loadSnapshot}>Load</Button>

      <StackedToast message={toastMessage} />

      {/*<Button onClick={toggleShowA} className="mb-2">*/}
      {/*  Toggle Toast <strong>with</strong> Animation*/}
      {/*</Button>*/}

      {/*<ToastContainer*/}
      {/*  className="p-3"*/}
      {/*  position={'top-center'}*/}
      {/*  style={{*/}
      {/*    zIndex: 10,*/}
      {/*    position: 'fixed', // Use fixed positioning*/}
      {/*    top: '0', // Align to the top*/}
      {/*    left: '50%', // Center horizontally*/}
      {/*    transform: 'translateX(-50%)', // Adjust for centering*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Toast show={showA} onClose={toggleShowA} autohide delay={3000}>*/}
      {/*    <Toast.Header>*/}
      {/*      <img*/}
      {/*        src="holder.js/20x20?text=%20"*/}
      {/*        className="rounded me-2"*/}
      {/*        alt=""*/}
      {/*      />*/}
      {/*      <strong className="me-auto">Bootstrap</strong>*/}
      {/*      <small>11 mins ago</small>*/}
      {/*    </Toast.Header>*/}
      {/*    <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>*/}
      {/*  </Toast>*/}
      {/*</ToastContainer>*/}
    </>
  );
};
