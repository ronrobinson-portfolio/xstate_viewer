import React, {ReactNode, useRef} from 'react';
import { OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import { OverlayTriggerType } from 'react-bootstrap/OverlayTrigger';

export default ({
  tip,
}: {
  tip: string | { header: string; body: ReactNode };
}) => {
  const getTrigger = (): OverlayTriggerType[] => {
    return typeof tip == 'string' ? ['hover', 'focus'] : ['click'];
  };

  const getIcon = () => {
    return typeof tip == 'string'
      ? 'bi-question-circle-fill'
      : 'bi-info-square-fill';
  };

  const getOverLay = () => {
    if (typeof tip == 'string') {
      return <Tooltip id="tooltip-top">{tip}</Tooltip>;
    }

    return (
      <Popover id="popover-basic">
        <Popover.Header as="h3">{tip.header}</Popover.Header>
        <Popover.Body>{tip.body}</Popover.Body>
      </Popover>
    );
  };

  return (
    <div
      style={{
        flexGrow: 1,
        justifyContent: 'end',
        display: 'flex',
      }}
    >
      <OverlayTrigger
        trigger={getTrigger()}
        overlay={getOverLay()}
        rootClose={true}
      >
        <i
          className={getIcon() + ' pe-3'}
          style={{ color: 'cornflowerblue' }}
          onClick={(e) => e.stopPropagation()}
        ></i>
      </OverlayTrigger>
    </div>
  );
};
