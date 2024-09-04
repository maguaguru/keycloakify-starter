import { lazy } from "react";
//import { KcAccountUiLoader } from "@keycloakify/keycloak-account-ui/KcAccountUiLoader";
import { KcAccountUiLoader } from "./KcAccountUiLoader";
import type { KcContext } from "./KcContext";
import "./eLearningAccount.css"

const KcAccountUi = lazy(() => import("./KcAccountUi"));
//const KcAccountUi = lazy(() => import("@keycloakify/keycloak-account-ui/KcAccountUi"));

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;
    return <KcAccountUiLoader
        kcContext={kcContext}
        KcAccountUi={KcAccountUi}
        content={[
            {
                label: "personalInfo",
                path: ""
            },
            {
                label: "accountSecurity",
                children: [
                    {
                        label: "signingIn",
                        path: "account-security/signing-in"
                    },
                    {
                        label: "deviceActivity",
                        path: "account-security/device-activity"
                    }
                ]
            }
        ]}
    />;
}
