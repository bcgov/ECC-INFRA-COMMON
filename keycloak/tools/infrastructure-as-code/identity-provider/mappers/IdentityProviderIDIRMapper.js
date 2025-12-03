const IDIR_ALIAS = "idir"; //change this if you want to test creating the identity provider to match the constant in the script file
/**
 * Retrieves the identity provider mapping for BCEID business based on the Keycloak environment.
 *
 * @function getBCEIDBusinessIdentityProviderMap
 * @param {string} kcEnvironment - The Keycloak environment (dev, test, or prod).
 * @param {string} clientId - The client ID for the identity provider.
 * @param {string} clientSecret - The client secret for the identity provider.
 */
function getIDIRIdentityProviderMap(
  kcEnvironment,
  clientId,
  clientSecret
) {
  if (!clientId || !clientSecret) {
    throw new Error("Client ID and Client Secret are required.");
  }

  let baseURL = "https://loginproxy.gov.bc.ca";

  if (kcEnvironment === "dev") {
    baseURL = "https://dev.loginproxy.gov.bc.ca";
  } else if (kcEnvironment === "test") {
    baseURL = "https://test.loginproxy.gov.bc.ca";
  }

  console.log(`Base URL: ${baseURL}`);

  return {
    alias: IDIR_ALIAS,
    displayName: IDIR_ALIAS,
    providerId: "oidc",
    enabled: true,
    updateProfileFirstLoginMode: "on",
    trustEmail: false,
    storeToken: false,
    addReadTokenRoleOnCreate: false,
    authenticateByDefault: false,
    linkOnly: false,
    hideOnLogin: false,
    firstBrokerLoginFlowAlias: "first broker login",
    config: {
      userInfoUrl: `${baseURL}/auth/realms/standard/protocol/openid-connect/userinfo`,
      validateSignature: "true",
      clientId: clientId,
      tokenUrl: `${baseURL}/auth/realms/standard/protocol/openid-connect/token`,
      jwksUrl: `${baseURL}/auth/realms/standard/protocol/openid-connect/certs`,
      issuer: `${baseURL}/auth/realms/standard`,
      useJwksUrl: "true",
      loginHint: "true",
      authorizationUrl: `${baseURL}/auth/realms/standard/protocol/openid-connect/auth?kc_idp_hint=idir`,
      clientAuthMethod: "client_secret_post",
      logoutUrl: `${baseURL}/auth/realms/standard/protocol/openid-connect/logout`,
      syncMode: "FORCE",
      clientSecret: clientSecret,
      defaultScope: "openid profile email",
    },
  };
}

function getIDIRMappers() {
  console.log("getting IDIR mappers");
  return [
    {
      name: "guid",
      identityProviderAlias: IDIR_ALIAS,
      identityProviderMapper: "oidc-user-attribute-idp-mapper",
      config: {
        syncMode: "INHERIT",
        claim: "idir_user_guid",
        "user.attribute": "guid",
      },
    },
    {
      name: "identity_provider",
      identityProviderAlias: IDIR_ALIAS,
      identityProviderMapper: "oidc-user-attribute-idp-mapper",
      config: {
        syncMode: "INHERIT",
        claim: "identity_provider",
        "user.attribute": "identity_provider",
      },
    },
    {
      name: "idir_username",
      identityProviderAlias: IDIR_ALIAS,
      identityProviderMapper: "oidc-user-attribute-idp-mapper",
      config: {
        syncMode: "INHERIT",
        claim: "idir_username",
        "user.attribute": "idir_username",
      },
    },
    {
      name: "username",
      identityProviderAlias: IDIR_ALIAS,
      identityProviderMapper: "oidc-username-idp-mapper",
      config: {
        syncMode: "INHERIT",
        template: "${CLAIM.idir_user_guid}@${ALIAS}",
      },
    },
  ];
}

export { getIDIRIdentityProviderMap, getIDIRMappers };
