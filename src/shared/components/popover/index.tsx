import { forwardRef, useImperativeHandle, useState } from 'react';
import { Popover } from 'react-tiny-popover';

interface PopoverProps extends PopoverContentProps {
  triggerElm: any;
  customClass?: string;
  positions?: ('left' | 'right' | 'top' | 'bottom')[]; // preferred positions by priority. Ex: ['top', 'bottom', 'left', 'right']
  toggleCondition?: boolean;
  ref?: any;
  align?: 'start' | 'center' | 'end';
}

interface PopoverContentProps {
  title?: string;
  content: any;
}

const PopoverContent = ({ title, content }: PopoverContentProps) => {
  return (
    <div className="popover-container">
      {
        title &&
        <div className="popover-header">
          <h6 className="popover-title">{ title }</h6>
        </div>
      }
      <div className="popover-content">
        { content }
      </div>
    </div>
  );
};

const DynamicPopover = forwardRef(({
  triggerElm,
  customClass,
  positions,
  title,
  content,
  toggleCondition,
  align,
}: PopoverProps, ref) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    isOpen: isPopoverOpen,
    closePopover() {
      setIsPopoverOpen(false);
    },
    openPopover() {
      togglePopover();
    }
  }));

  const togglePopover = () => {
    if (toggleCondition === false) {
      return;
    }
    setIsPopoverOpen(prev => !prev);
  };

  const handleClickOutSide = () => {
    setIsPopoverOpen(false);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    togglePopover();
  };

  return (
    <Popover
      containerClassName={`popover ${customClass} ml-2 z-1`}
      isOpen={ isPopoverOpen }
      onClickOutside={handleClickOutSide}
      positions={ positions || ['right'] }
      content={ <PopoverContent title={ title } content={ content } /> }
      align={ align || 'center' }
    >
      <div className="flex-center-y popover-wrapper" onClick={ handleClick }>
        { triggerElm }
      </div>
    </Popover>
  );
});

export default DynamicPopover;
