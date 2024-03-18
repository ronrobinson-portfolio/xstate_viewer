import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { useMemo } from 'react';
import { Actor, MachineSnapshot } from 'xstate';
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
    if (!events.length) {
      return (
        <div className="alert alert-warning text-center" role="alert">
          No available events at this state
        </div>
      );
    }

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
      <div className="d-flex flex-xs-row flex-lg-column gap-2 border border-dark p-2 h-100 rounded">
        <p className={'fw-bold'}>
          Events
          <OverlayTrigger
            overlay={
              <Tooltip id="tooltip-disabled">
                Next available events at current state
              </Tooltip>
            }
          >
            <span className="d-inline-block">
              <i
                className={'bi-info-circle-fill ps-1'}
                style={{ color: 'cornflowerblue' }}
                onClick={(e) => e.stopPropagation()}
              ></i>
            </span>
          </OverlayTrigger>
        </p>
        {getEventButtons()}
      </div>
    </>
  );
};

export default EventLayout;
