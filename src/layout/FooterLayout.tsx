import { Card, CardBody, Tab, Tabs } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Actor, ActorOptions, MachineSnapshot, SnapshotFrom } from 'xstate';
import MachineActions from './footer/MachineActions';
import MachineStates from './footer/MachineStates';
import MachineSnapshots from './footer/MachineSnapshots';
import { StateMachine } from '../hooks/useStateMachineDebugger';

interface FooterLayout {
  machine: MachineSnapshot<any, any, any, any, any, any> | null;
  actor: Actor<any> | null;
  meta: { [index: string]: any };
  resetActor: (
    options?: ActorOptions<StateMachine> & {},
  ) => Actor<StateMachine>;
}

const FooterLayout = ({ machine, actor, meta, resetActor }: FooterLayout) => {
  const [actorState, setActorState] = useState<Actor<any> | null>(null);
  const [actorSnapshot, setActorSnapshot] = useState<SnapshotFrom<any> | null>(
    actor?.getSnapshot() ?? null,
  );

  // State machine actor
  useEffect(() => {
    setActorState(null);
    setActorSnapshot(null);

    const subscription = actor?.subscribe((state) => {
      setActorState(state);
      setActorSnapshot(actor?.getSnapshot());
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [actor]);

  return (
    <>
      <Card.Footer>
        <Tabs defaultActiveKey="tab_actions" className="border-bottom-0">
          <Tab eventKey="tab_actions" title="Action">
            <Card>
              <CardBody>
                <MachineActions machine={machine} actor={actor} />
              </CardBody>
            </Card>
          </Tab>
          <Tab eventKey="tab_state" title="State">
            <MachineStates
              machine={machine}
              actorState={actorState}
              actorSnapshot={actorSnapshot}
              meta={meta}
            />
          </Tab>
          <Tab eventKey="tab_snapshot" title="Snapshots">
            <Card>
              <CardBody>
                <MachineSnapshots
                  machine={machine}
                  actorState={actorState}
                  actorSnapshot={actorSnapshot}
                  meta={meta}
                  resetActor={resetActor}
                />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </Card.Footer>
    </>
  );
};

export default FooterLayout;
