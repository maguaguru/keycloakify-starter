import { CallOptions } from "@keycloakify/keycloak-account-ui/api/methods";
import { MenuItem } from "@keycloakify/keycloak-account-ui/root/PageNav";
import { joinPath } from "@keycloakify/keycloak-account-ui/utils/joinPath";

export default async function fetchContentJson(
  opts: CallOptions,
): Promise<MenuItem[]> {
  const response = await fetch(
    joinPath(opts.context.environment.resourceUrl, "/content.json"),
    opts,
  );
  return await response.json();
}
