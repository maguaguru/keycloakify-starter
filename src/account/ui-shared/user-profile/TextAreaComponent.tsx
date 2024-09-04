import { KeycloakTextArea } from "@keycloakify/keycloak-account-ui/ui-shared/controls/keycloak-text-area/KeycloakTextArea";
import { UserProfileFieldProps } from "@keycloakify/keycloak-account-ui/ui-shared/user-profile/UserProfileFields";
import { UserProfileGroup } from "@keycloakify/keycloak-account-ui/ui-shared/user-profile/UserProfileGroup";
import { fieldName, isRequiredAttribute } from "@keycloakify/keycloak-account-ui/ui-shared/user-profile/utils";

export const TextAreaComponent = (props: UserProfileFieldProps) => {
  const { form, attribute } = props;
  const isRequired = isRequiredAttribute(attribute);

  return (
    <UserProfileGroup {...props}>
      <KeycloakTextArea
        id={attribute.name}
        data-testid={attribute.name}
        {...form.register(fieldName(attribute.name))}
        cols={attribute.annotations?.["inputTypeCols"] as number}
        rows={attribute.annotations?.["inputTypeRows"] as number}
        readOnly={attribute.readOnly}
        isRequired={isRequired}
      />
    </UserProfileGroup>
  );
};
