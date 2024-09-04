import {
  Avatar,
  AvatarProps,
  Brand,
  BrandProps,
  DropdownItem,
} from "@patternfly/react-core";
import {
  PageHeader,
  PageHeaderProps,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
} from "@patternfly/react-core/deprecated";
import { TFunction } from "i18next";
import Keycloak, { type KeycloakTokenParsed } from "keycloak-js";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { DefaultAvatar } from "@keycloakify/keycloak-account-ui/ui-shared/masthead/DefaultAvatar";
import { KeycloakDropdown } from "@keycloakify/keycloak-account-ui/ui-shared/masthead/KeycloakDropdown";

function loggedInUserName(
  token: KeycloakTokenParsed | undefined,
  t: TFunction,
) {
  if (!token) {
    return t("unknownUser");
  }

  const givenName = token.given_name;
  const familyName = token.family_name;
  const preferredUsername = token.preferred_username;

  if (givenName && familyName) {
    return t("fullName", { givenName, familyName });
  }

  return givenName || familyName || preferredUsername || t("unknownUser");
}

type BrandLogo = BrandProps & {
  href: string;
};

type KeycloakMastheadProps = PageHeaderProps & {
  keycloak: Keycloak;
  brand: BrandLogo;
  avatar?: AvatarProps;
  features?: {
    hasLogout?: boolean;
    hasManageAccount?: boolean;
    hasUsername?: boolean;
  };
  kebabDropdownItems?: ReactNode[];
  dropdownItems?: ReactNode[];
  toolbarItems?: ReactNode[];
};

const KeycloakMasthead = ({
  keycloak,
  brand: { href: brandHref, ...brandProps },
  avatar,
  features: {
    hasLogout = true,
    hasManageAccount = true,
    hasUsername = true,
  } = {},
  kebabDropdownItems,
  dropdownItems = [],
  toolbarItems,
  ...rest
}: KeycloakMastheadProps) => {
  const { t } = useTranslation();
  const extraItems = [];
  if (hasManageAccount) {
    extraItems.push(
      <DropdownItem
        key="manageAccount"
        onClick={() => keycloak.accountManagement()}
      >
        {t("manageAccount")}
      </DropdownItem>,
    );
  }
  if (hasLogout) {
    extraItems.push(
      <DropdownItem key="signOut" onClick={() => keycloak.logout()}>
        {t("signOut")}
      </DropdownItem>,
    );
  }

  const picture = keycloak.idTokenParsed?.picture;

  return (
    <PageHeader
      {...rest}
      /*logo={<Brand {...brandProps} />}
      logoProps={{ href: brandHref }}*/
      headerTools={
        <PageHeaderTools>
          <PageHeaderToolsGroup>
            {/*<PageHeaderToolsItem
              visibility={{
                md: "hidden",
              }}
            >
              *<KeycloakDropdown
                data-testid="options-kebab"
                isKebab
                dropDownItems={[
                  ...(kebabDropdownItems || dropdownItems),
                  extraItems,
                ]}
              />
            </PageHeaderToolsItem>*/}
            <PageHeaderToolsItem>
              <a id="go-home-button" type="button" style={{textDecoration:"none"}} target="_self" href={window.location.origin}>
                <svg id="go-home-button-icon" xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#FCFAF9"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </a>
            </PageHeaderToolsItem>
            <div className="pf-page__header-title"><h1>{t("headerTitle")}</h1></div>

            {/*<PageHeaderToolsItem>{toolbarItems}</PageHeaderToolsItem>*/}
            {/*<PageHeaderToolsItem
              visibility={{
                default: "hidden",
                md: "visible",
              }}
            >
              <KeycloakDropdown
                data-testid="options"
                dropDownItems={[...dropdownItems, extraItems]}
                title={
                  hasUsername
                    ? loggedInUserName(keycloak.idTokenParsed, t)
                    : undefined
                }
              />
            </PageHeaderToolsItem>*/}
          </PageHeaderToolsGroup>
         {/* {picture || avatar?.src ? (
            <Avatar {...{ src: picture, alt: t("avatar"), ...avatar }} />
          ) : (
            <DefaultAvatar {...avatar} />
          )}*/}
        </PageHeaderTools>
      }
    />
  );
};

export default KeycloakMasthead;
