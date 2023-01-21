import styled from '@emotion/styled';

interface PageProps {
  className?: string;
  header?: JSX.Element;
  content: React.ReactNode;
  footer?: JSX.Element;
}

function Page({ className, header, content, footer }: PageProps) {
  return (
    <Container className={className}>
      {header && (
        <>
          <HeaderWrapper>{header}</HeaderWrapper>
          {/*
            TODO: replace this with a better solution
            Since the header is position: fixed, this spacer
            servers to push the content down below the header.
            This is not  ideal as it creates a duplicate header
            (i.e., extra html that is unused) but the other easy
            solution I can think of is to add a padding-top to the
            header component of 64px, but that leads to the size
            being defined in 2 separate places, which is also bad
          */}
          <HeaderSpacer>{header}</HeaderSpacer>
        </>
      )}
      <Main>{content}</Main>
      {footer && <FooterWrapper>{footer}</FooterWrapper>}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
`;

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  // TODO: this is a bad idea, avoid z-index if possible
  // need to place header in front of all other content
  z-index: 100;
`;

const HeaderSpacer = styled.div`
  visibility: hidden;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const FooterWrapper = styled.div`
  width: 100%;
`;

export default Page;
