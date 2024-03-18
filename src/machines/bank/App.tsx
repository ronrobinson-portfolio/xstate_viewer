import React, { useMemo } from 'react';
import { machine } from './machine';
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap';
import useStateMachineDebugger from '../../hooks/useStateMachineDebugger';
import Tooltip from '../../components/ui/Tooltip';
import { useParams } from 'react-router-dom';
import { setupWorker } from 'msw/browser'
import { handlers } from '../../api/mocks/handlers'
import axios from 'axios';

// TODO: Move to global level so entire application can use the worker
export const worker = setupWorker(...handlers)
worker.start()

const initialAtmMessage: { [index: string]: string } = {
  '1': 'Out of service',
  '2': 'Out of $10 bills',
};

export default function App() {
  const { messageId } = useParams<{ messageId?: string }>();
  const { state, actor, send, resetActor } = useStateMachineDebugger({
    machine,
    actorOptions: {
      input: {
        initialMessage:
          (messageId && initialAtmMessage[messageId]) ??
          'Welcome, Please insert your card',
      },
    },
    metaInfo: {
      meta: 'atm machine',
      ref: 'from my brain',
    },
  });

  // TODO:
  // Find use of getNextSnapshot() https://stately.ai/docs/machines#determining-the-next-state
  // Find use of fromPromise()  https://stately.ai/docs/input#creating-actors-with-input
  // Find use of fromTransition() https://stately.ai/docs/input#creating-actors-with-input
  // Find use of fromObservable() https://stately.ai/docs/input#creating-actors-with-input
  // Find use of invoke: https://stately.ai/docs/input#invoking-actors-with-input
  // Find use of https://stately.ai/docs/input#invoking-actors-with-input

  // Calculated values
  const atmDisplayText = useMemo(() => {
    // Text can also be retrieved from actor
    // console.log(actor?.getSnapshot().context.atm.displayText);
    return state.context.atm.displayText ?? '...';
  }, [state]);

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

  const test =  () => {
    axios
        .get('/pet')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });

  }

  return (
      <Card bg={'Primary'} style={{ width: '18rem' }} className="mb-2">
        <Card.Header className={'d-flex justify-content-between '}>
          ATM
          <i
            className="bi bi-trash-fill"
            role={'button'}
            onClick={() =>
              resetActor({
                input: {
                  initialMessage:
                    'System Restarted - ' +
                    ((messageId && initialAtmMessage[messageId]) ??
                      'Welcome, Please insert your card'),
                },
              })
            }
          ></i>
        </Card.Header>
        <Card.Body>
          <Alert variant={'success'}>
            <div className="d-flex flex-row">
              <div>{atmDisplayText}</div>

              <Tooltip
                tip={{
                  header:
                    'Text can also be retrieved from actor (uncomment in code)',
                  body: (
                    <span>
                      console.log(actor?.getSnapshot().context.atm.displayText);{' '}
                    </span>
                  ),
                }}
              />
            </div>
          </Alert>

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
