import {
  Button,
  Col,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap';
import React, { useMemo, useState } from 'react';
import { Actor, MachineSnapshot } from 'xstate';
import { getNextEventsWithMeta } from '../utils/machineUtils';

interface FooterLayout {
  machine: MachineSnapshot<any, any, any, any, any, any> | null;
  actor: Actor<any> | null;
  meta: { [index: string]: any };
}

class FormControlElement {}

const EventLayout = ({ machine, actor, meta }: FooterLayout) => {
  //const events = useMemo(() => getNextEvents(machine), [machine]);
  const events = useMemo(() => getNextEventsWithMeta(machine), [machine]);

  // Modal
  const [modalEvent, setModalEvent] = useState<any>(null);
  const [formParams, setFormParams] = useState<any>({});

  const handleClose = () => {
    resetModal();
  };

  // Send event
  const sendEvent = (event: string, params: any) => {
    if (!params.length) {
      actor?.send({ type: event });
      return;
    }

    setModalEvent({ event, params });
  };

  const sendEventWithParams = () => {
    actor?.send({ type: modalEvent.event, payload: formParams } as any);
    resetModal();
  };

  const updateFormParams = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormParams({ ...formParams, [name]: value });
  };

  const resetModal = () => {
    setModalEvent(null);
    setFormParams({});
  };

  // TODO: make EventButtons component
  const getEventButtons = () => {
    if (!Object.keys(events).length) {
      return (
        <div className="alert alert-warning text-center" role="alert">
          No available events at this state
        </div>
      );
    }

    return Object.entries(events).map(
      ([eventName, eventParams]: [string, any]) => (
        <Button
          key={eventName}
          variant="primary"
          style={
            {
              '--bs-btn-padding-y': '.25rem',
              '--bs-btn-padding-x': '.5rem',
              '--bs-btn-font-size': '.75rem',
            } as any
          }
          onClick={() => sendEvent(eventName, eventParams)}
        >
          {eventParams?.length ? <i className="bi bi-p-circle-fill" /> : ''}{' '}
          {eventName}
        </Button>
      ),
    );
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
      <Modal show={!!modalEvent} onHide={handleClose} animation={false}>
        <Modal.Header closeButton={true} onHide={handleClose}>
          <Modal.Title>Set Params for {modalEvent?.event}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {modalEvent &&
              modalEvent?.params.map((param: any) => (
                <Form.Group
                  key={param}
                  as={Row}
                  className="mb-3"
                  controlId={`formHorizontal${param}`}
                >
                  <Form.Label column sm={2}>
                    {param}
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      name={param}
                      onChange={updateFormParams}
                    />
                  </Col>
                </Form.Group>
              ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClose}
          >
            cancel
          </Button>
          <Button type="button" variant="primary" onClick={sendEventWithParams}>
            send event
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EventLayout;
