import React from 'react';
import { MachineSnapshot } from 'xstate';
import { Alert } from 'react-bootstrap';

interface Machine {
  machineSnapshot: MachineSnapshot<any, any, any, any, any, any> | null;
}

const Machine = ({ machineSnapshot }: Machine) => {
  if (!machineSnapshot) {
    return <Alert variant={'warning'}>Machine snapshot not provided</Alert>;
  }

  return <pre>{JSON.stringify(machineSnapshot, null, 2)}</pre>;
};

export default Machine;
