import { Accordion } from 'react-bootstrap';
import FooterItem from './FooterItem';
import Machine from '../../components/machine/Machine';
import React from 'react';
import { Actor, MachineSnapshot } from 'xstate';

interface MachineStates {
  machine: MachineSnapshot<any, any, any, any, any, any> | null;
  actorState: Actor<any> | null;
  actorSnapshot: any;
  meta: { [index: string]: any };
}

export default ({
  machine,
  actorState,
  actorSnapshot,
  meta,
}: MachineStates) => {
  return (
    <Accordion alwaysOpen>
      {/*Machine State */}
      <FooterItem
        eventKey={'machine'}
        header={'Machine State'}
        tip={'machine: useMachine()'}
      >
        <Machine machineSnapshot={machine} />
      </FooterItem>

      {/*Machine Meta*/}
      <FooterItem
        eventKey={'machine meta'}
        header={'Machine Meta'}
        tip={'machine: machine.getMeta()'}
      >
        {machine && JSON.stringify(machine?.getMeta(), null, 2)}
      </FooterItem>

      {/*Actor State*/}
      <FooterItem
        eventKey={'actor state'}
        header={'Actor State'}
        tip={'actor: state'}
      >
        <pre>{actorState && JSON.stringify(actorState, null, 2)}</pre>
      </FooterItem>

      {/*Actor Snapshot*/}
      <FooterItem
        eventKey={'actor snapshot'}
        header={'Actor Snapshot'}
        tip={{
          header: 'actor snapshot',
          body: '[https://stately.ai/docs/states#state-object]',
        }}
      >
        <pre>{actorSnapshot && JSON.stringify(actorSnapshot, null, 2)}</pre>
      </FooterItem>

      {/*Custom*/}
      <FooterItem
        eventKey={'custom'}
        header={'Custom'}
        tip={'custom meta info'}
      >
        <pre>{meta && JSON.stringify(meta, null, 2)}</pre>
      </FooterItem>
    </Accordion>
  );
};
