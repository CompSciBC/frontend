import styled from '@emotion/styled';
import ReactDOM from 'react-dom';

export interface ModalProps {
  className?: string;
  content: JSX.Element;
  blur?: boolean;
}

/**
 * Blocks off the screen to display the given content
 *
 * @param props {@link ModalProps}
 * @returns A react portal
 */
function Modal({ className, content, blur }: ModalProps) {
  const modalContainerId = 'modal-container';
  let modalContainer = document.getElementById(modalContainerId);

  if (!modalContainer) {
    // create element to mount modal to
    modalContainer = document.createElement('div');
    modalContainer.setAttribute('id', modalContainerId);
    document.body.appendChild(modalContainer);
  }

  return ReactDOM.createPortal(
    <Background className={className} blur={!!blur}>
      <ContentWrapper>{content}</ContentWrapper>
    </Background>,
    modalContainer
  );
}

const Background = styled.div<{ blur: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.blur ? 'rgba(0, 0, 0, 0.6)' : 'transparent'};
  z-index: 101;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export default Modal;
