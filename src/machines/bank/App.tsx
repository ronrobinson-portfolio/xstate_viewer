import React, { useMemo } from 'react';
import { machine } from './machine';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import useStateMachineDebugger from '../../hooks/useStateMachineDebugger';

export default function App() {
  const { state, actor, send } = useStateMachineDebugger(machine, {
    meta: 'atm machine',
    ref: 'from my brain',
  });

  const atmDisplayText = useMemo(
    () => actor?.getSnapshot().context.atm.displayText,
    [actor],
  );

  // Events
  const insertCard = () => {
    send({ type: 'event.card_insert' });
  };

  const canInsertCard = () => {
    return state.can({ type: 'event.card_insert' });
  };

  const manualContinue = (displayText?: string) => {
    send({
      type: 'event.manual_continue',
      displayText: displayText + Math.random().toString(),
    });
  };

  const canContinue = () => {
    return state.can({ type: 'event.manual_continue' });
  };

  return (
    <Card bg={'Primary'} style={{ width: '18rem' }} className="mb-2">
      <Card.Header>ATM</Card.Header>
      <Card.Body>
        <Card.Text>{atmDisplayText}</Card.Text>
        <Card.Text>{actor?.getSnapshot().context.atm.displayText}</Card.Text>
        <Button
          variant="outline-success"
          size={'sm'}
          disabled={!state.hasTag('pin')}
        >
          <span className="bi-grid-3x3-gap-fill mx-1" />
          Pin
        </Button>
      </Card.Body>
      <Card.Footer>
        <Container fluid className={'text-center'}>
          <Row>
            <Col>
              <Button
                variant="primary"
                onClick={insertCard}
                size="sm"
                disabled={!canInsertCard()}
              >
                Insert Card
              </Button>
            </Col>
            <Col>
              <Button
                className={'col'}
                variant="primary"
                onClick={() => manualContinue('text from event')}
                size="sm"
                disabled={!canContinue()}
              >
                Continue
              </Button>
            </Col>
          </Row>
        </Container>
      </Card.Footer>
    </Card>
  );
}
