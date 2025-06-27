export default function authHeader() {
  const obj = JSON.parse(sessionStorage.getItem("authUser"));
  return obj?.token ? { Authorization: `Bearer ${obj.token}` } : {};
}