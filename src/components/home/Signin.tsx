import styled from '@emotion/styled';

export interface SignInProps {
  className?: string;
}

function SignIn({ className }: SignInProps) {
  return <Container className={className}>SignIn</Container>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export default SignIn;
