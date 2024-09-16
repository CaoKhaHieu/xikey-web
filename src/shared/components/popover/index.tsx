import { forwardRef, useImperativeHandle, useState } from 'react';
import { Popover } from 'react-tiny-popover';

interface PopoverProps extends PopoverContentProps {
  triggerElm: any;
  customClass?: string;
  parentElement?: any;
  positions?: ('left' | 'right' | 'top' | 'bottom')[]; // preferred positions by priority. Ex: ['top', 'bottom', 'left', 'right']
  toggleCondition?: boolean;
  ref?: any;
  align?: 'start' | 'center' | 'end';
  padding?: number;
  onClickTrigger?: () => void;
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
  parentElement,
  title,
  content,
  toggleCondition,
  align,
  padding = 0,
  onClickTrigger,
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
    onClickTrigger && onClickTrigger();
  };

  return (
    <Popover
      containerClassName={`popover ${customClass} ml-2 z-10`}
      isOpen={ isPopoverOpen }
      onClickOutside={handleClickOutSide}
      positions={ positions }
      content={ <PopoverContent title={ title } content={ content } /> }
      parentElement={parentElement}
      padding={padding}
      align={align}
    >
      <div className="flex-center-y popover-wrapper" onClick={ handleClick }>
        { triggerElm }
      </div>
    </Popover>
  );
});

export default DynamicPopover;
