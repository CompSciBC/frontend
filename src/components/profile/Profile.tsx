import styled from '@emotion/styled';

function Profile() {
  return (
    <Container>
      <h1>Profile</h1>
      <p> role = { localStorage.getItem('role') }</p>
      <p> User Name = { localStorage.getItem('username') }</p>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  row-gap: 32px;
  font-size: 18px;
`;
export default Profile;
