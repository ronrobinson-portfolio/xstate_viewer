import { Button } from 'react-bootstrap';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Actor, MachineSnapshot, SnapshotFrom } from 'xstate';
import { getNextEvents } from '../utils/machineUtils';

interface FooterLayout {
  machine: MachineSnapshot<any, any, any, any, any, any> | null;
  actor: Actor<any> | null;
  meta: { [index: string]: any };
}

const EventLayout = ({ machine, actor, meta }: FooterLayout) => {
  const events = useMemo(() => getNextEvents(machine), [machine]);

  const sendEvent = (event: string) => {
    actor?.send({ type: event });
  };

  // TODO: make EventButtons component
  const getEventButtons = () => {
    return events.map((event) => {
      return (
        <Button
          key={event}
          variant="primary"
          style={
            {
              '--bs-btn-padding-y': '.25rem',
              '--bs-btn-padding-x': '.5rem',
              '--bs-btn-font-size': '.75rem',
            } as any
          }
          onClick={() => sendEvent(event)}
        >
          {event}
        </Button>
      );
    });
  };

  return (
    <>
      <div className="d-flex flex-column gap-2 border border-dark p-2 h-100 rounded">
        {getEventButtons()}
      </div>
    </>
  );
};

export default EventLayout;
