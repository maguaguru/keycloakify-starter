import { Suspense, useMemo, type LazyExoticComponent } from "react";
import { assert } from "tsafe/assert";
import { is } from "tsafe/is";
import type { Environment } from "./environment";
import type { MenuItem } from "./root/PageNav";
import { joinPath } from "./utils/joinPath";
import defaultContent from "./public/content";
import defaultLogoSvgUrl from "./public/logo.svg";

export type KcContextLike = {
  serverBaseUrl: string;
  authUrl: string;
  authServerUrl: string;
  realm: {
    name: string;
    registrationEmailAsUsername: boolean;
    editUsernameAllowed: boolean;
    isInternationalizationEnabled: boolean;
    identityFederationEnabled: boolean;
    userManagedAccessAllowed: boolean;
  };
  clientId: string;
  resourceUrl: string;
  baseUrl: {
    rawSchemeSpecificPart: string;
    scheme: string;
  };
  locale: string;
  isAuthorizationEnabled: boolean;
  deleteAccountAllowed: boolean;
  updateEmailFeatureEnabled: boolean;
  updateEmailActionEnabled: boolean;
  isViewGroupsEnabled: boolean;
  isOid4VciEnabled: boolean;
};

type LazyExoticComponentLike = {
  _result: unknown;
};

export type KcAccountUiLoaderProps = {
  kcContext: KcContextLike;
  KcAccountUi: LazyExoticComponentLike;
  content?: MenuItem[];
  logoUrl?: string;
  loadingFallback?: JSX.Element;
};

export function KcAccountUiLoader(props: KcAccountUiLoaderProps) {
  const { KcAccountUi, loadingFallback, ...paramsOfInit } = props;

  assert(is<LazyExoticComponent<() => JSX.Element | null>>(KcAccountUi));

  useMemo(() => init(paramsOfInit), []);

  return (
    <Suspense fallback={loadingFallback}>
      {(() => {
        const node = <KcAccountUi />;

        if (node === null) {
          return loadingFallback;
        }

        return node;
      })()}
    </Suspense>
  );
}

let previousRunParamsFingerprint: string | undefined = undefined;

function init(
  params: Pick<KcAccountUiLoaderProps, "kcContext" | "content" | "logoUrl">,
) {
  exit_condition: {
    const paramsFingerprint = JSON.stringify(params);

    if (previousRunParamsFingerprint === undefined) {
      previousRunParamsFingerprint = paramsFingerprint;
      break exit_condition;
    }

    if (paramsFingerprint !== previousRunParamsFingerprint) {
      window.location.reload();
      return;
    }

    return;
  }

  const { content = defaultContent, kcContext } = params;

  const logoUrl = (() => {
    const logoUrl_params = params.logoUrl ?? defaultLogoSvgUrl;

    const url = new URL(
      logoUrl_params.startsWith("http")
        ? logoUrl_params
        : joinPath(window.location.origin, logoUrl_params),
    );

    return url.href.substring(url.origin.length);
  })();

  const resourceUrl = kcContext.resourceUrl;

  if (!logoUrl.startsWith(resourceUrl)) {
    const error = new Error(`ERROR: The logo url can't be an external url.`);
    alert(error.message);
    throw error;
  }

  const environment = {
    serverBaseUrl: kcContext.serverBaseUrl,
    authUrl: kcContext.authUrl,
    authServerUrl: kcContext.authServerUrl,
    realm: kcContext.realm.name,
    clientId: kcContext.clientId,
    resourceUrl,
    logo: logoUrl.substring(resourceUrl.length),
    logoUrl: logoUrl,
    baseUrl: `${kcContext.baseUrl.scheme}:${kcContext.baseUrl.rawSchemeSpecificPart}`,
    locale: kcContext.locale,
    referrerName:
      readQueryParamOrRestoreFromSessionStorage({ name: "referrer" }) ?? "",
    referrerUrl:
      readQueryParamOrRestoreFromSessionStorage({ name: "referrer_uri" }) ?? "",
    features: {
      isRegistrationEmailAsUsername:
        kcContext.realm.registrationEmailAsUsername,
      isEditUserNameAllowed: kcContext.realm.editUsernameAllowed,
      isInternationalizationEnabled:
        kcContext.realm.isInternationalizationEnabled,
      isLinkedAccountsEnabled: kcContext.realm.identityFederationEnabled,
      isMyResourcesEnabled:
        kcContext.realm.userManagedAccessAllowed &&
        kcContext.isAuthorizationEnabled,
      deleteAccountAllowed: kcContext.deleteAccountAllowed,
      updateEmailFeatureEnabled: kcContext.updateEmailFeatureEnabled,
      updateEmailActionEnabled: kcContext.updateEmailActionEnabled,
      isViewGroupsEnabled: kcContext.isViewGroupsEnabled,
      isOid4VciEnabled: kcContext.isOid4VciEnabled,
    },
  };

  {
    assert<typeof environment extends Environment ? true : false>();

    const script = document.createElement("script");
    script.id = "environment";
    script.type = "application/json";
    script.textContent = JSON.stringify(environment, null, 1);

    document.body.appendChild(script);
  }

  const realFetch = window.fetch;

  window.fetch = async function fetch(...args) {
    const [url] = args;

    if (url === joinPath(environment.resourceUrl, "/content.json")) {
      return {
        json: () => Promise.resolve(content),
      } as Response;
    }

    return realFetch(...args);
  };
}

function readQueryParamOrRestoreFromSessionStorage(params: {
  name: string;
}): string | undefined {
  const { name } = params;

  const url = new URL(window.location.href);

  const value = url.searchParams.get(name);

  const PREFIX = "keycloakify:";

  if (value !== null) {
    sessionStorage.setItem(`${PREFIX}${name}`, value);
    url.searchParams.delete(name);
    window.history.replaceState({}, "", url.toString());
    return value;
  }

  return sessionStorage.getItem(`${PREFIX}${name}`) ?? undefined;
}
