import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../../utils/styles';
import CloseX from './CloseX';
import { NavbarLink } from './Navbar';

export interface HamburgerMenuProps {
  className?: string;
  size?: number;
  navLinks?: NavbarLink[];
}

function HamburgerMenu({ className, size = 32, navLinks }: HamburgerMenuProps) {
  const [visible, setVisible] = useState(false);
  const menuId = 'hamburger-menu';

  useEffect(() => {
    const menu = document.getElementById(menuId);

    if (visible) {
      menu?.classList.add('hamburger-menu-open');
    } else {
      menu?.classList.remove('hamburger-menu-open');
    }
  }, [visible]);

  return (
    <div className={className}>
      <Button type="button" size={size} onClick={() => setVisible(!visible)}>
        <img src="/bmg-branding/Menu.svg" />
      </Button>
      <Container id={menuId}>
        <StyledCloseX size={size} onClick={() => setVisible(false)} />
        {navLinks?.map((link) => (
          <StyledLink
            key={link.name}
            to={link.path}
            onClick={() => setVisible(false)}
          >
            {link.name}
          </StyledLink>
        ))}
      </Container>
    </div>
  );
}

const Button = styled.button<{ size: number }>`
  background-color: transparent;
  border: none;
  padding: 0;

  img {
    height: ${(props) => `${props.size}px`};
  }
`;

const Container = styled.nav`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 48px;
  background-color: ${theme.color.white};
  transform: translateX(-100%);
  transition: transform 0.15s ease-out;

  &.hamburger-menu-open {
    transform: translateX(0);
  }
`;

const StyledLink = styled(Link)`
  padding: 16px;
  background-color: white;
  color: inherit;
  ${theme.font.body}

  text-decoration: none;
  border-bottom: 1px solid ${theme.color.lightGray};
  text-transform: uppercase;

  :hover {
    background-color: ${theme.color.lightGray};
    color: inherit;
  }
`;

const StyledCloseX = styled(CloseX)<{ size: number }>`
  position: absolute;
  top: 10px;
  right: 10px;
  width: ${(props) => `${props.size}px`};
  height: ${(props) => `${props.size}px`};
  padding: ${(props) => `${0.2 * props.size}px`};

  :hover {
    background-color: ${theme.color.lightGray};
  }
`;

export default HamburgerMenu;
