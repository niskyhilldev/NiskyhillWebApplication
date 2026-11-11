//Context File to allow user information to easily be accessed between components  for User Roles

import { createContext, useContext } from "react";

export const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);