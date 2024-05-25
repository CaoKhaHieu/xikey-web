import { forwardRef, useEffect, useRef } from 'react';
import classNames from 'classnames';

interface TextAreaOptions {
  className?: string;
  height?: string;
  [otherProps: string]: any;
  limitRows?: number;
}

const TextArea = forwardRef((props: TextAreaOptions, ref: any) => {
  const { className, height, limitRows = 1, ...otherProps } = props;
  const textareaRef = useRef<any>(null);
  const defaultLineHeight = textareaRef.current?.lineHeight || 16;
  const defaultHeightArea = height || 20;

  useEffect(() => {
    const { current } = textareaRef;
    if (!height) {
      const maxHeight = ((current.scrollHeight || defaultHeightArea) + ( defaultLineHeight * (limitRows - 1)));
      current.addEventListener('input', () => {
        // Auto Grow a Textarea, update when input change
        current.style.height = 'auto';
        updateHeight(maxHeight);
      });
    } else {
      current.style.height = height;
    }
  }, []);

  useEffect(() => {
    const { current } = textareaRef;
    // Clear height when user cancel comment
    if (!textareaRef.current.value) {
      current.style.overflow = 'hidden';
      current.style.height = defaultHeightArea + 'px';
    } else {
      // update height when no focus in input.
      const maxHeight = +defaultHeightArea + defaultLineHeight * (limitRows - 1);
      updateHeight(maxHeight);
    }

    if (height) {
      current.style.overflowY = 'scroll';
    }
  }, [textareaRef?.current?.value, textareaRef?.current?.style?.height]);

  const updateHeight = (maxHeight: number) => {
    const { current } = textareaRef;
    if (current.scrollHeight <= maxHeight) {
      current.style.overflow = 'hidden';
      current.style.height = current.scrollHeight + 'px';
    } else {
      current.style.overflowY = 'scroll';
      current.style.height = maxHeight + 'px';
    }
  };

  return (
    <textarea
      ref={(node) => {
        // Share ref
        textareaRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        }
      }}
      rows={1}
      className={classNames(
        className,
        'w-full h-full resize-none overflow-hidden'
      )}
      {...otherProps}
    />
  );
});

export default TextArea;
