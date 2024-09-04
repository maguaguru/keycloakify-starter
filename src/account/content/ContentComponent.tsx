import { Spinner } from "@patternfly/react-core";
import { Suspense, lazy, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useEnvironment } from "@keycloakify/keycloak-account-ui/ui-shared";
import { MenuItem } from "@keycloakify/keycloak-account-ui/root/PageNav";
import { ContentComponentParams } from "@keycloakify/keycloak-account-ui/routes";
import { joinPath } from "@keycloakify/keycloak-account-ui/utils/joinPath";
import { usePromise } from "@keycloakify/keycloak-account-ui/utils/usePromise";
import fetchContentJson from "@keycloakify/keycloak-account-ui/content/fetchContent";

function findComponent(
  content: MenuItem[],
  componentId: string,
): string | undefined {
  for (const item of content) {
    if (
      "path" in item &&
      item.path.endsWith(componentId) &&
      "modulePath" in item
    ) {
      return item.modulePath;
    }
    if ("children" in item) {
      return findComponent(item.children, componentId);
    }
  }
  return undefined;
}

export const ContentComponent = () => {
  const context = useEnvironment();

  const [content, setContent] = useState<MenuItem[]>();
  const { componentId } = useParams<ContentComponentParams>();

  usePromise((signal) => fetchContentJson({ signal, context }), setContent);
  const modulePath = useMemo(
    () => findComponent(content || [], componentId!),
    [content, componentId],
  );

  return modulePath && <Component modulePath={modulePath} />;
};

type ComponentProps = {
  modulePath: string;
};

const Component = ({ modulePath }: ComponentProps) => {
  const { environment } = useEnvironment();

  const Element = lazy(
    () => import(joinPath(environment.resourceUrl, modulePath)),
  );
  return (
    <Suspense fallback={<Spinner />}>
      <Element />
    </Suspense>
  );
};

export default ContentComponent;
