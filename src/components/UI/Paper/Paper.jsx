import { css } from "@emotion/css";
import classes from "./Paper.module.css";

const paper = ({children, size}) => {
  const fixedSize = size || "auto";
  const paperWithSize = css(classes.paper, {height: fixedSize, width: fixedSize});

  return (
    <div className={paperWithSize}>{children}</div>
  );
}

export default paper;