import React, { useMemo } from 'react';
import { machine } from './machine';
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  ProgressBar,
  Row,
} from 'react-bootstrap';
import useStateMachineDebugger from '../../hooks/useStateMachineDebugger';
import { useParams } from 'react-router-dom';

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

  // useEffect(() => {
  //   actor?.subscribe({
  //     error: (err) => {
  //       console.error(err);
  //     },
  //   });
  //
  //   //return actor?.unsubscribe;
  // }, [actor]);

  // TODO:
  // Find use of getNextSnapshot() https://stately.ai/docs/machines#determining-the-next-state
  // Find use of fromPromise()  https://stately.ai/docs/input#creating-actors-with-input
  // Find use of fromTransition() https://stately.ai/docs/input#creating-actors-with-input
  // Find use of fromObservable() https://stately.ai/docs/input#creating-actors-with-input
  // Find use of invoke: https://stately.ai/docs/input#invoking-actors-with-input
  // Find use of https://stately.ai/docs/input#invoking-actors-with-input

  /*
   * Helper
   */
  const hasTag = (tag: string) => {
    return !!state?.hasTag(tag);
  };

  const notHaveTag = (tag: string) => {
    return !hasTag(tag);
  };

  const canInsertCard = () => {
    return state.can({ type: 'event.card_insert' });
  };

  const canContinue = () => {
    return state.can({ type: 'event.manual_continue' });
  };

  /*
   * Calculated values
   */

  const atmIndicatorBar = useMemo(() => {
    if (hasTag('loading')) {
      return {
        variant: 'warning',
        animated: true,
      };
    }

    if (hasTag('error')) {
      return {
        variant: 'danger',
        animated: false,
      };
    }

    if (hasTag('card')) {
      return {
        variant: 'success',
        animated: false,
      };
    }

    return {
      variant: 'light',
      animated: false,
    };
  }, [state]);

  const atmDisplayVariant = useMemo(() => {
    if (hasTag('pin') && state.context.pin_error) {
      return 'danger';
    }

    return 'success';
  }, [state]);

  const atmDisplayText = useMemo(() => {
    // Text can also be retrieved from actor
    // console.log(actor?.getSnapshot().context.atm.displayText);

    if (hasTag('pin') && state.context.pin_error) {
      return state.context.pin_error;
    }

    if (hasTag('pin') && state.context.entered_pin) {
      return state.context.entered_pin;
    }

    return state.context.atm.displayText ?? '...';
  }, [state]);

  const account = useMemo(() => {
    console.log('debug: account changed - ', state.context.account);

    return state.context.account;
  }, [state.context.account]);

  const accountAccountSummary = useMemo(() => {
    const account = state.context.account;
    if (!account) {
      return '';
    }

    return ` [${account.id} - ${account.account_name}]`;
  }, [account]);

  const pinVisibleClass = useMemo(() => {
    return hasTag('pin') ? 'visible' : 'invisible';
  }, [state.tags]);

  /*
   * Events
   */

  const insertCard = (cardId: number) => {
    send({ type: 'event.card_insert', payload: { cardId } });
  };

  const manualContinue = (displayText?: string) => {
    send({
      type: 'event.manual_continue',
      displayText: displayText + Math.random().toString(),
    });
  };

  const pressPinPadButton = (button: string | number) => {
    send({
      type: 'event.pinpad_button_press',
      payload: { button },
    });
  };

  return (
    <div className={'d-flex align-items-start mb-2 '}>
      {/*ATM*/}
      <Card style={{ width: '18rem' }} className="me-2">
        <Card.Header className={'d-flex justify-content-between '}>
          ATM {accountAccountSummary}
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
        <Card.Body className="pt-1">
          <ProgressBar
            className="mb-1"
            style={{ height: '4px' }}
            variant={atmIndicatorBar.variant}
            animated={atmIndicatorBar.animated}
            now={100}
          />

          <Alert variant={atmDisplayVariant}>
            <div className="d-flex flex-row">
              <div>{atmDisplayText}</div>
              {/*<Tooltip*/}
              {/*  tip={{*/}
              {/*    header:*/}
              {/*      'Text can also be retrieved from actor (uncomment in code)',*/}
              {/*    body: (*/}
              {/*      <span>*/}
              {/*        console.log(actor?.getSnapshot().context.atm.displayText);{' '}*/}
              {/*      </span>*/}
              {/*    ),*/}
              {/*  }}*/}
              {/*/>*/}
            </div>
          </Alert>

          <div className={'d-flex justify-content-evenly'}>
            <Button
              variant="outline-success"
              size={'sm'}
              style={{ pointerEvents: 'none' }}
              disabled={notHaveTag('pin')}
            >
              <span className="bi-grid-3x3-gap-fill mx-1" />
              Pin
            </Button>

            <Button
              variant="outline-success"
              size={'sm'}
              style={{ pointerEvents: 'none' }}
              disabled={!state.hasTag('user_choice')}
            >
              <span className="bi-copy mx-1" />
              Choice
            </Button>
          </div>
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

      {/*PIN PAD*/}
      <Card
        border={'success'}
        className={pinVisibleClass}
        style={{ width: '16rem' }}
      >
        <Card.Header className={'d-flex'}>Pin Pad</Card.Header>
        <Card.Body>
          <Row xs={3} className={'g-1'}>
            {Array.from({ length: 9 }, (_, i) => (
              <Col key={i}>
                <Button
                  variant="secondary"
                  onClick={() => pressPinPadButton(i + 1)}
                >
                  {i + 1}
                </Button>
              </Col>
            ))}
            <Col>{/* Placeholder for alignment */}</Col>
            <Col>
              <Button variant="secondary" onClick={() => pressPinPadButton(0)}>
                0
              </Button>
            </Col>
            <Col>
              <Button
                variant="danger"
                onClick={() => pressPinPadButton('delete')}
              >
                <i className={'bi-backspace'} />
              </Button>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Container fluid className={'text-center'}>
            <Row>
              <Col>
                <Button
                  className={'col'}
                  variant="primary"
                  size="sm"
                  onClick={() => pressPinPadButton('enter')}
                >
                  enter
                </Button>
              </Col>
            </Row>
          </Container>
        </Card.Footer>
      </Card>
    </div>
  );
}
