import React, { useMemo } from 'react';
import { machine } from './machine';
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Row,
} from 'react-bootstrap';
import useStateMachineDebugger from '../../hooks/useStateMachineDebugger';
import Tooltip from '../../components/ui/Tooltip';
import { useParams } from 'react-router-dom';
import { setupWorker } from 'msw/browser';
import { handlers } from '../../api/mocks/handlers';

// TODO: Move to global level so entire application can use the worker
export const worker = setupWorker(...handlers);
worker.start();

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

  /*
   * Calculated values
   */

  const atmDisplayText = useMemo(() => {
    // Text can also be retrieved from actor
    // console.log(actor?.getSnapshot().context.atm.displayText);
    return state.context.atm.displayText ?? '...';
  }, [state]);

  const card = useMemo(() => {
    console.log('debug: card changed - ', state.context.card);

    return state.context.card;
  }, [state.context.card]);

  const cardAccountSummary = useMemo(() => {
    const card = state.context.card;
    if (!card) {
      return '';
    }

    return ` [${card.id} - ${card.account_name}]`;
  }, [card]);

  /*
   * Events / Helpers
   */

  const insertCard = (cardId: number) => {
    send({ type: 'event.card_insert', payload: { cardId } });
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
      <Card.Header className={'d-flex justify-content-between '}>
        ATM {cardAccountSummary}
        <i
          className="bi bi-arrow-repeat"
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
              <ButtonGroup aria-label="Credit cards">
                <Button
                  variant="light"
                  disabled={!canInsertCard()}
                  onClick={() => insertCard(1)}
                >
                  <i className={'bi-credit-card-2-front'} />
                </Button>
                <Button
                  variant="light"
                  disabled={!canInsertCard()}
                  onClick={() => insertCard(2)}
                >
                  <i className={'bi-credit-card-2-front'} />
                </Button>
              </ButtonGroup>
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
