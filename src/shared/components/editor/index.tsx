import { useEffect, useRef } from 'react';

import MediumEditor from 'medium-editor';
import 'medium-editor/dist/css/medium-editor.min.css';
import 'medium-editor/dist/css/themes/default.css';
import { useTranslation } from 'react-i18next';

interface EditorOptions {
  value: string;
  onChange: (value: string) => void;
}

const Editor = ({ value, onChange }: EditorOptions) => {
  const refEditor: any = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    let editor = new MediumEditor('.editable', {
      toolbar: {
        allowMultiParagraphSelection: true,
        buttons: [
          'bold',
          'italic',
          'underline',
          'h2',
          'h3',
          'justifyLeft',
          'justifyCenter',
          'justifyRight',
          'justifyFull',
        ],
        diffLeft: 0,
        diffTop: -10,
        firstButtonClass: 'medium-editor-button-first',
        lastButtonClass: 'medium-editor-button-last',
        standardizeSelectionStart: false,
        static: false,
        align: 'center',
        sticky: false,
        updateOnEmptySelection: false,
      },
      anchorPreview: {
        hideDelay: 0,
        previewValueSelector: 'a',
      },
      placeholder: {
        text: t('type_message'),
        hideOnClick: false,
      },
      paste: {
        forcePlainText: true,
        cleanPastedHTML: false,
        cleanReplacements: [],
        cleanAttrs: ['class', 'style', 'dir'],
        cleanTags: ['meta'],
        unwrapTags: [],
      },
      autoLink: true,
      imageDragging: true,
      disableExtraSpaces: true,
    });
    refEditor.current = editor;
    refEditor.current.subscribe(
      'editableInput',
      function (event: any, editable: any) {
        if (onChange && typeof onChange === 'function') {
          onChange(editable.innerHTML);
        }
      }
    );
  }, []);

  useEffect(() => {
    console.log({ value})
    if (!value) {
      refEditor.current.resetContent('');
    }
    onChange(value);
  }, [value]);

  return (
    <>
      <div className="editable w-full outline-none !min-h-16 !max-h-72 !overflow-scroll"></div>
    </>
  );
};

export default Editor;
