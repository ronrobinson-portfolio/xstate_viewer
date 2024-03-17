import React, { useMemo, useState } from 'react';
import { Link, Outlet, RouteObject, useLocation } from 'react-router-dom';
import {
  Badge,
  Card,
  Col,
  Container,
  ListGroup,
  Navbar,
  Row,
} from 'react-bootstrap';
import routes from '../routes/routes';
import { Actor, ActorOptions, MachineSnapshot } from 'xstate';
import FooterLayout from './FooterLayout';
import EventLayout from './EventLayout';
import { StateMachine } from '../hooks/useStateMachineDebugger';

type MetaType = { [index: string]: any };

export default function AppLayout() {
  // Route
  const location = useLocation();
  const currentRoute = routes.find((route) => route.path === location.pathname);
  const currentRouteName = currentRoute ? currentRoute.id : 'Select a machine';

  /* Local React states */
  const [isFluid, setIsFluid] = useState(false);
  const fluidContainerIcon = useMemo(
    () => (isFluid ? 'bi-arrows-angle-contract' : 'bi-arrows-angle-expand'),
    [isFluid],
  );
  const toggleContainerWidth = () => setIsFluid(!isFluid);

  /* Global React states */
  // TODO: Passing setters as Outlet context, just create a new global context so they can be used elsewhere
  // like the footer. That way they don't have to be passed down as props. */

  // Default Machine state info (setters will override default as user selects a state machine
  const [meta, setMeta] = useState<MetaType>({});
  const [machine, setMachine] = useState<MachineSnapshot<
    any,
    any,
    any,
    any,
    any,
    any
  > | null>(null);
  const [actor, setActor] = useState<Actor<any> | null>(null);
  const [resetActor, setResetActor] = useState<
    ((options?: ActorOptions<StateMachine> & {}) => Actor<StateMachine>) | null
  >(null);

  return (
    <Container fluid={isFluid}>
      <Row>
        <Col xs={12} lg={2}>
          <ListGroup>
            {routes.map((route: RouteObject) => (
              <ListGroup.Item
                key={route.id}
                action
                as={Link}
                to={route.path ?? '/unknown'}
              >
                {route.id}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col xs={12} lg={10}>
          <Card>
            <Card.Header>
              <Navbar className={'p-0 d-flex justify-content-between p-0'}>
                <Navbar.Brand>{currentRouteName}</Navbar.Brand>
                <Badge
                  pill={true}
                  role={'button'}
                  className={'rounded-circle '}
                  onClick={toggleContainerWidth}
                >
                  <i className={`${fluidContainerIcon} fw-bold`}></i>
                </Badge>
              </Navbar>
            </Card.Header>
            <Card.Body>
              <Container>
                <Row>
                  <Col sm={12} lg={8} xl={10}>
                    <div className="App">
                      <div>
                        {/*Context of the app - children will set the current machine*/}
                        <Outlet context={{ setMeta, setMachine, setActor, setResetActor }} />
                      </div>
                    </div>
                  </Col>
                  {/*Current state machine pass to event layout */}
                  <Col sm={12} lg={4} xl={2}>
                    <EventLayout machine={machine} meta={meta} actor={actor} />
                  </Col>
                </Row>
              </Container>
            </Card.Body>
            {/*Current state machine pass to footer */}
            <FooterLayout machine={machine} meta={meta} actor={actor} resetActor={resetActor} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
