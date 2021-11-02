import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
import { ReactElement, cloneElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({
  children,
  activeClassName,
  ...restProps
}: ActiveLinkProps) {
  const { asPath } = useRouter();

  const className = asPath === restProps.href ? activeClassName : "";

  return <Link {...restProps}>{cloneElement(children, { className })}</Link>;
}
