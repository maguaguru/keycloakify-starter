import { PropsWithChildren } from "react";
import { createNamedContext } from "@keycloakify/keycloak-account-ui/ui-shared/utils/createNamedContext";
import { useRequiredContext } from "@keycloakify/keycloak-account-ui/ui-shared/utils/useRequiredContext";
import { useStoredState } from "@keycloakify/keycloak-account-ui/ui-shared/utils/useStoredState";

type HelpContextProps = {
  enabled: boolean;
  toggleHelp: () => void;
};

export const HelpContext = createNamedContext<HelpContextProps | undefined>(
  "HelpContext",
  undefined,
);

export const useHelp = () => useRequiredContext(HelpContext);

export const Help = ({ children }: PropsWithChildren) => {
  const [enabled, setHelp] = useStoredState(localStorage, "helpEnabled", true);

  function toggleHelp() {
    setHelp(!enabled);
  }

  return (
    <HelpContext.Provider value={{ enabled, toggleHelp }}>
      {children}
    </HelpContext.Provider>
  );
};
