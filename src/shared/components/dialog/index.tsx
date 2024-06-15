/* eslint-disable no-console */
import React, { cloneElement, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';

import styles from './style.module.scss';
import { DIALOG_POSITION } from '@/shared/enums';

// import CloseIcon from '@assets/icons/close.svg?react';
import CloseIcon from "../../../assets/icons/close.svg?react";

const ZINDEX_DEFAULT = 1000;

interface DialogContextOptions {
  appendDialog: (props: any) => void;
  editDialog: (props: any, index: any) => void;
  closeAllDialogs: () => void;
  closeCurrentDialog: (index: number) => void;
  closeDialogByName: (name: string) => void;
  openDialog: (props: any) => void;
  dialogs: [];
}

export const DialogContext = React.createContext({} as DialogContextOptions);

const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

const DialogProvider = (props: any) => {
  const location = useLocation();
  const [dialogs, setDialogs] = useState<any>([]);

  const appendDialog = (dialog: any) => {
    setDialogs([...dialogs, dialog]);
  };

  const editDialog = (dialog: any, index: any) => {
    dialogs[index] = dialog;
    setDialogs([...dialogs]);
  };

  const openDialog = (dialog: any) => {
    setDialogs([dialog]);
  };

  const closeAllDialogs = () => {
    setDialogs([]);
  };

  const closeCurrentDialog = (index: number) => {
    dialogs.splice(index, 1);
    setDialogs([...dialogs]);
  };

  const closeDialogByName = (name: string) => {
    const newDialogs = dialogs.filter((dialog: any) => dialog?.props?.name !== name);
    setDialogs(newDialogs);
  };

  const renderDialogView = (dialog: any, index: number) => {
    return cloneElement(dialog, {
      close: (data: any) => {
        if (
          dialog.props.afterClosed &&
          typeof dialog.props.afterClosed === 'function'
        ) {
          dialog.props?.afterClosed(data);
        }

        closeCurrentDialog(index);
      },
    });
  };

  const flexStyle = (position: number) => {
    switch (position) {
      case DIALOG_POSITION.BOTTOM:
        return styles.flexEnd;
      case DIALOG_POSITION.TOP:
        return styles.flexStart;
      default:
        return styles.flexCenter;
    }
  };

  useEffect(() => {
    closeAllDialogs();
  }, [location.pathname, location.search]);

  const freezeVp = function(e: any) {
    e.preventDefault();
  };

  useEffect(() => {
    if (dialogs.length) {
      document.body.classList.add('prevent-scroll');
      document.body.addEventListener('touchmove', freezeVp, false);
    } else {
      document.body.classList.remove('prevent-scroll');
      document.body.removeEventListener('touchmove', freezeVp, false);
    }
  }, [dialogs]);

  return (
    <DialogContext.Provider
      value={{ appendDialog, editDialog, closeAllDialogs, closeCurrentDialog, closeDialogByName, openDialog, dialogs }}
    >
      {dialogs?.length > 0 && (
        <>
          {dialogs.map((dialog: any, index: number) => (
            <div key={`dialog-${index}`}>
              <>
                {!dialog.props?.hideBackdrop &&
                  <div
                    className={styles.dialogBackdrop}
                    style={{ zIndex: ZINDEX_DEFAULT + index + index }}
                    onClick={() => {
                      closeCurrentDialog(index);
                      if (
                        dialog?.props?.afterClosed &&
                        typeof dialog.props.afterClosed === 'function'
                      ) {
                        dialog.props?.afterClosed();
                      }
                    }}
                  />
                }
                <div
                  className={classNames(styles.dialogWrapper, flexStyle(dialog.props?.position))}
                  style={{ zIndex: ZINDEX_DEFAULT + index + index + 1 }}
                  onClick={(e) => e.preventDefault()}
                >
                  {renderDialogView(dialog, index)}
                </div>
              </>
            </div>
          ))}
        </>
      )}
      {props.children}
    </DialogContext.Provider>
  );
};

const Dialog = (props: any) => {
  const { showCloseBtn = true, className, closeRight = false, close, style } = props;

  return (
    <div
      style={style}
      className={classNames(className, styles.dialogContainer)}
      onClick={(e) => e.stopPropagation()}
    >
      {showCloseBtn && (
        <button
          className={classNames('btn-close z-20 absolute text-sm top-4',
            closeRight ? 'right-4' : 'left-4',
          )}
          onClick={close}
        >
          <CloseIcon />
        </button>
      )}
      {props.children}
    </div>
  );
};

Dialog.Header = (props: any) => (
  <div className={classNames('dialog-title', styles.dialogHeader, props.className)}>
    {props.children}
  </div>
);

Dialog.Body = React.forwardRef((props: any, ref: any) => (
  <div ref={ref} className={classNames('dialog-body', styles.dialogBody, props.className)}>
    {props.children}
  </div>
));

Dialog.Footer = (props: any) => (
  <div className={classNames('dialog-footer', styles.dialogFooter, props.className)}>
    {props.children}
  </div>
);

export { DialogProvider, Dialog, useDialog };
