import { Google } from "arctic";

export const google = new Google(
  process.env.OAUTH_GOOGLE_ID ?? "",
  process.env.OAUTH_GOOGLE_SECRET ?? "",
  process.env.OAUTH_REDIRECT_URL ?? "",
);
