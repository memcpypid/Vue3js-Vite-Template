/**
 * Simple cookie utility that works on both client and server (via passed context)
 */

export const getCookie = (name, cookieStr = "") => {
  if (typeof document !== "undefined") {
    cookieStr = document.cookie;
  }

  const value = `; ${cookieStr}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const setCookie = (name, value, days = 7) => {
  if (typeof document === "undefined") return;

  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
};

export const removeCookie = (name) => {
  if (typeof document === "undefined") return;
  document.cookie = name + "=; Max-Age=-99999999; path=/;";
};
