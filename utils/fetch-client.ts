import Cookies from "js-cookie";
import { ofetch } from "ofetch";

export const client = ofetch.create({
  async onRequest({ request, options }) {
    const token = Cookies.get("elogbook_token");
    options.headers = { ...options.headers, "x-api-key": token || "" };
  },
});
