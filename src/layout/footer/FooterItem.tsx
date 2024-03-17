import { Accordion } from 'react-bootstrap';
import Tooltip from '../../components/ui/Tooltip';
import React, { ReactNode } from 'react';

export default ({
  eventKey,
  header,
  tip,
  children,
}: {
  eventKey: string;
  header: string;
  tip: string | { header: string; body: ReactNode };
  children: ReactNode;
}) => {
  return (
    <Accordion.Item eventKey={eventKey} className={'reversed'}>
      <Accordion.Header>
        {header}
        <Tooltip tip={tip} />
      </Accordion.Header>
      <Accordion.Body>{children}</Accordion.Body>
    </Accordion.Item>
  );
};
