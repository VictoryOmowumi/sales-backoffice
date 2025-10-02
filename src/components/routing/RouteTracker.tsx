import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRecents } from "@/store/recents";
import { nav } from "@/config/nav";

function bestLabel(pathname: string) {
  const leaves: { to: string; label: string }[] = [];
  const walk = (i: any) => {
    if (i.children?.length) i.children.forEach(walk);
    else if (i.to) leaves.push({ to: i.to, label: i.label });
  };
  nav.forEach(walk);
  // longest prefix match
  const match = leaves
    .filter((l) => pathname.startsWith(l.to))
    .sort((a, b) => b.to.length - a.to.length)[0];
  return match?.label ?? pathname;
}

export default function RouteTracker() {
  const { pathname, search } = useLocation();
  const { push } = useRecents();

  useEffect(() => {
    const path = `${pathname}${search}`;
    push({ path, label: bestLabel(pathname), ts: Date.now() });
  }, [pathname, search, push]);

  return null;
}
