import { createContext } from "react";

const UserContext = createContext({
  username : "unknown",
  updateUsername: () => {},
});

export default UserContext;