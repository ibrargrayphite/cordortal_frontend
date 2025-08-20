export function getCookie(name) {
  return (
    document.cookie
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(name))
      ?.split("=")[1] || null
  );
}
