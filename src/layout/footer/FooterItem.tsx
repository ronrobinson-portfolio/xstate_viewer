import { Accordion } from 'react-bootstrap';
import Tooltip from '../../components/ui/Tooltip';
import React, { ReactNode, useEffect } from 'react';

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
      <Accordion.Body>
        <span className="visually-hidden" id="bd-theme-text">
          Toggle theme
        </span>
        {children}
      </Accordion.Body>
    </Accordion.Item>
  );
};
