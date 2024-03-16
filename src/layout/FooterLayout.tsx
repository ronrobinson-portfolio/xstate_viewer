import { Card, CardBody, Tab, Tabs } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Actor, MachineSnapshot, SnapshotFrom } from 'xstate';
import MachineActions from './footer/MachineActions';
import MachineStates from './footer/MachineStates';
import { getNextEvents } from '../utils/machineUtils';

interface FooterLayout {
  machine: MachineSnapshot<any, any, any, any, any, any> | null;
  actor: Actor<any> | null;
  meta: { [index: string]: any };
}

const FooterLayout = ({ machine, actor, meta }: FooterLayout) => {
  const [actorState, setActorState] = useState<Actor<any> | null>(null);
  const [actorSnapshot, setActorSnapshot] = useState<SnapshotFrom<any> | null>(
    actor?.getSnapshot() ?? null,
  );

  // State machine actor
  useEffect(() => {
    actor?.subscribe((state) => {
      setActorState(state);
      setActorSnapshot(actor?.getSnapshot());
    });
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
        </Tabs>
      </Card.Footer>
    </>
  );
};

export default FooterLayout;
