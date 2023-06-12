import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { memo, useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { paramRoute, routes } from '../../..';
import { Message } from '../../../utils/dtos';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellWrapper from '../DashboardCellWrapper';
import ChevronDown from '../../reservations/ChevronDown';
import getMessages from './getChatMessages';

export interface ChatPreviewProps extends DashboardCellProps {
  n: number;
}

/**
 * Displays a list of chat messages
 *
 * @param props {@link ChatPreviewProps}
 * @returns A JSX element
 */

function ChatPreview({ className, cell, n }: ChatPreviewProps) {
  const { reservation, user } = useContext(AppContext);
  const [messages, setMessages] = useState<Message[]>([]);

  const { resId } = useParams() as { resId: string };

  useEffect(() => {
    let subscribed = true;

    (async function () {
      if (subscribed && reservation) {
        const messages: Message[] = await getMessages(resId, user!);

        setMessages(messages);
      }
    })().catch(() => {
      setMessages([
        {
          name: 'Host',
          me: false,
          time: new Date(),
          message: 'Hello'
        }
      ]);
    });

    return () => {
      subscribed = false;
    };
  }, [reservation]); // TODO: this should update whenever new messages arrive

  return (
    <Container
      className={className}
      cell={cell}
      child={
        <>
          <Header>
            <div>Chat</div>
            <GoToChatButton to={paramRoute(routes.chat, reservation?.id)}>
              <ChevronDown fill="white" width={24} />
            </GoToChatButton>
          </Header>
          <Body>
            <Ellipses>
              <div>. . .</div>
            </Ellipses>
            {messages.map((message, i) => (
              <MessageContainer key={i} me={message.me}>
                <div>
                  <div>{message.name}</div>
                </div>
                {message.message}
              </MessageContainer>
            ))}
          </Body>
        </>
      }
    />
  );
}

const Container = styled(DashboardCellWrapper)`
  ${theme.screen.small} {
    display: none;
  }

  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${theme.color.white};
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  padding: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: ${theme.color.white};
  background-color: ${theme.color.BMGyellow2};
`;

const GoToChatButton = styled(Link)`
  position: absolute;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 8px;
  text-decoration: none;

  svg {
    transform: rotate(-90deg);
  }

  :hover {
    background-color: ${theme.color.red};
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  padding: 4px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: ${theme.color.lightGray};

  > div:last-of-type {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const Ellipses = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 16px;
  font-size: 48px;
  color: ${theme.color.gray};
`;

const MessageContainer = styled.div<{ me: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.me ? 'end' : 'start')};
  column-gap: 8px;
  padding: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: ${theme.color.white};

  // avatar wrapper
  > div {
    order: ${(props) => (props.me ? 1 : -1)};
    display: flex;
    align-items: flex-start;
    height: 100%;

    // avatar
    div {
      min-width: 48px;
      height: fit-content;
      padding: 8px;
      border-radius: 8px;
      text-align: center;
      background-color: ${(props) =>
        props.me ? theme.color.blue : theme.color.green};
      color: ${theme.color.white};
    }
  }
`;

export default memo(ChatPreview);
