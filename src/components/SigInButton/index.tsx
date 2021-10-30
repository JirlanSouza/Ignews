import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

import styles from "./styles.module.scss";

export function SigInButton() {
  const isUserLoggedIn = true;
  return isUserLoggedIn ? (
    <button type="button" className={styles.sigInButton}>
      <FaGithub color="#04b361" />
      Jirlan Souza
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button type="button" className={styles.sigInButton}>
      <FaGithub color="#eba417" />
      SingIn with GitHub
    </button>
  );
}
