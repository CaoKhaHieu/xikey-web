import { ReactElement } from 'react';
import { PlacesType, Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface TooltipProps {
  className: string;
  id: string;
  content: string;
  place?: PlacesType;
  children: ReactElement;
};

const Tooltip = (props: TooltipProps) => {
  const { className, id, content, children, place } = props;
  return (
    <>
      <div data-tooltip-id={id} data-tooltip-content={content}>
        {children}
      </div>
      <ReactTooltip id={id} place={place} className={className} />
    </>
  );
};

export default Tooltip;
