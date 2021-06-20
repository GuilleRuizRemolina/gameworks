import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// export default () => useContext(AuthContext);

const Named = () => useContext(AuthContext);

export default Named;