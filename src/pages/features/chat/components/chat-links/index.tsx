import { useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Popover } from 'react-tiny-popover'
import { useTranslation } from "react-i18next";

import { Conversation, Link } from "@/shared/models/Conversation";
import { User } from "@/shared/models/User";
import { useDialog } from "@/shared/components/dialog";
import LinksDialog from "@/shared/components/dialog/templates/LinksDialog";
import ConfirmDialog from "@/shared/components/dialog/templates/ConfirmDialog";
import { deleteLink, selectConversation } from "@/stores/conversation/action";

const ChatLinks = () => {
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation }: { currentConversation: Conversation } = conversation;
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);

  const [isOpen, setIsOpen] = useState<{linkId: string}>({linkId: ''});

  const { appendDialog } = useDialog();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleRightClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, link: Link) => {
    if (!user.isAdmin) {
      return;
    }
    event.preventDefault();
    setIsOpen({
      linkId: link.id
    });
  };

  const handleEditLink = (link: Link) => {
    appendDialog(
      <LinksDialog
        link={link}
        onClick={() => setIsOpen({
          linkId: ''
        })}
      />
    );
  };

  const handleDeleteLink = (link: Link) => {
    appendDialog(
      <ConfirmDialog
        title={t('are_you_sure')}
        content={t('sure_delete_link')}
        onClick={() => {
          dispatch(deleteLink({
            conversationId: currentConversation.id,
            linkId: link.id
          }, (conversationUpdated: Conversation) => {
            dispatch(selectConversation({ ...currentConversation, links: conversationUpdated.links }));
          }, () => {
          }))
        }}
      />
    );
  };

  return (
    <>
      {
        currentConversation.links.length > 0 &&
        <div className='flex flex-wrap px-4 py-1.5 border-b border-b-gray2'>
          {
            currentConversation.links.map((link: Link, index: number) => {
              return (
                <Popover
                  key={link.id}
                  isOpen={isOpen.linkId === link.id}
                  positions={['bottom', 'left']}
                  padding={10}
                  reposition={false}
                  onClickOutside={() => setIsOpen({linkId: ''})}
                  content={() => (
                    <div className="mt-auto shadow-2xl bg-white px-8 py-3 w-36 border border-gray2 rounded-md flex flex-col space-y-2">
                      <div className="text-sm cursor-pointer whitespace-nowrap" onClick={() => handleEditLink(link)}>{t('edit')}</div>
                      <div className="text-sm cursor-pointer whitespace-nowrap" onClick={() => handleDeleteLink(link)}>{t('delete')}</div>
                    </div>
                  )}
                >
                  <a
                    href={link.link}
                    target='_blank'
                    className={classNames('font-bold whitespace-nowrap mr-4 hover:underline', {
                      'text-red1': index % 2 === 1,
                      'text-blue1': index % 2 === 0,
                    })}
                    onContextMenu={(event) => handleRightClick(event, link)}
                  >
                    {link.title}
                  </a>
                </Popover>
              )
            })
          }
        </div>
      }
    </>
  );
};

export default ChatLinks;
