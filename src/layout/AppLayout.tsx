import React, { useState } from 'react';
import { Link, Outlet, RouteObject, useLocation } from 'react-router-dom';
import { Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import routes from '../routes/routes';
import { Actor, MachineSnapshot } from 'xstate';
import FooterLayout from './FooterLayout';
import EventLayout from './EventLayout';

type MetaType = { [index: string]: any };

export default function AppLayout() {
  // Route
  const location = useLocation();
  const currentRoute = routes.find((route) => route.path === location.pathname);
  const currentRouteName = currentRoute ? currentRoute.id : 'Select a machine';

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

  const [fluidContainer, setFluidContainer] = useState(false);
  const toggleContainerWidth = () => setFluidContainer(!fluidContainer);

  return (
    <Container fluid={fluidContainer}>
      <Row>
        <Col>
          <ListGroup>
            <ListGroup.Item>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={toggleContainerWidth}
              >
                <i className={'bi-arrows-expand-vertical'}></i>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm mx-2"
                onClick={toggleContainerWidth}
              >
                <i className={'bi-arrows-collapse-vertical'}></i>
              </button>
            </ListGroup.Item>
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

        <Col xs={10}>
          <Card>
            <Card.Header>{currentRouteName}</Card.Header>{' '}
            <Card.Body>
              <Container>
                <Row>
                  <Col sm={10}>
                    <div className="App">
                      <div>
                        {/*Context of the app - children will set the current machine*/}
                        <Outlet context={{ setMeta, setMachine, setActor }} />
                      </div>
                    </div>
                  </Col>
                  {/*Current state machine pass to event layout */}
                  <Col sm={2}>
                    <EventLayout machine={machine} meta={meta} actor={actor} />
                  </Col>
                </Row>
              </Container>
            </Card.Body>
            {/*Current state machine pass to footer */}
            <FooterLayout machine={machine} meta={meta} actor={actor} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
