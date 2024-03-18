import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import React, { useState } from 'react';
import { Actor, MachineSnapshot } from 'xstate';

interface MachineActions {
  machine: MachineSnapshot<any, any, any, any, any, any> | null;
  actor: Actor<any> | null;
}

export default ({ machine, actor }: MachineActions) => {
  const [matchesInput, setMatchesInput] = useState('');
  const [hasTagInput, setHasTagInput] = useState('');
  const [canInput, setCanInput] = useState('');

  const getMatches = () => {
    if (!matchesInput) {
      return '';
    }

    return machine?.matches(matchesInput).toString();
  };

  const getCan = () => {
    if (!canInput) {
      return '';
    }

    return machine?.can({ type: canInput }).toString();
  };

  const getHasTag = () => {
    if (!hasTagInput) {
      return '';
    }

    return machine?.hasTag(hasTagInput).toString();
  };

  const getOutput = () => {
    // console.log(machine?.output)
    return JSON.stringify(actor?.getSnapshot().output ?? '', null, 2);
  };

  const getValue = () => {
    return JSON.stringify(machine?.value ?? '', null, 2);
  };

  const getDescription = () => {
    return machine?.machine.states[getValue()]?.description || '';
  };

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      {/*machine.matches()*/}
      <Row>
        <Col xs md={10}>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text className={'bg-light col-3'}>
              machine.matches()
            </InputGroup.Text>
            <Form.Control
              className={'col-3'}
              onChange={(e) => {
                setMatchesInput(e.target.value);
              }}
            />
            <InputGroup.Text className={'bg-warning-subtle col-6'}>
              = {getMatches()}
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>

      {/*machine.can()*/}
      <Row>
        <Col xs md={10}>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text className={'bg-light col-3'}>
              machine.can()
            </InputGroup.Text>
            <Form.Control
              className={'col-3'}
              onChange={(e) => {
                setCanInput(e.target.value);
              }}
            />
            <InputGroup.Text className={'bg-warning-subtle col-6'}>
              = {getCan()}
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>

      {/*machine.tag()*/}
      <Row>
        <Col xs md={10}>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text className={'bg-light col-3'}>
              machine.tag()
            </InputGroup.Text>
            <Form.Control
              className={'col-3'}
              onChange={(e) => {
                setHasTagInput(e.target.value);
              }}
            />
            <InputGroup.Text className={'bg-warning-subtle col-6'}>
              = {getHasTag()}
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>

      {/*machine.value*/}
      <Row>
        <Col xs md={10}>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text className={'bg-light col-3'}>
              machine.value
            </InputGroup.Text>
            <Form.Control className={'col-3'} disabled={true} />
            <InputGroup.Text className={'bg-warning-subtle col-6'}>
              = {getValue()}
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>

      {/*machine.machine.states[].description*/}
      <Row>
        <Col xs md={10}>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text className={'bg-light col-3'}>
              machine.description
            </InputGroup.Text>
            <Form.Control className={'col-3'} disabled={true} />
            <InputGroup.Text
              className={'bg-warning-subtle text-start text-wrap col-6'}
            >
              = {getDescription()}
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>

      {/*machine.output*/}
      <Row>
        <Col xs md={10}>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text className={'bg-light col-3'}>
              machine.output
            </InputGroup.Text>
            <Form.Control className={'col-3'} disabled={true} />
            <InputGroup.Text className={'bg-warning-subtle col-6 text-wrap'}>
              = {getOutput()}
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
    </Form>
  );
};
