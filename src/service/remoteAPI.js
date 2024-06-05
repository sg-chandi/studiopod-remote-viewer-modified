import HTTPRequest from "./http";

import {
  AUTHENTICATE,
  BOOTH_DETAILS,
  BOOTH_DAILY_MODE,
  AVAILABLE_CLIENTS,
  DEFAULT_ORDER,
  SESSION,
  BOOTH_PRESET,
  CORPORATE_PRESET,
  BOOTH_ZONE_SETTINGS,
  DAILY_ORDER_CREATE,
  CLUB_BOOTH_URL,
  CLIENT_ZONE_SETTINGS
} from "./endpoints";

export const authenticate = (email, password) => {
  const data = {
    username: email,
    password: password,
  };
  return HTTPRequest({ Method: "post", Url: AUTHENTICATE, Data: data });
};

export const getBoothDetails = (userId) => {
  return HTTPRequest({ Method: "get", Url: BOOTH_DETAILS(userId) });
};

export const checkBoothMode = () => {
  return HTTPRequest({ Method: "get", Url: BOOTH_DAILY_MODE });
};

export const checkAvailableClients = (name, email) => {
  const payload = {
    emailId: email,
    name: name,
  };
  return HTTPRequest({ Method: "post", Url: AVAILABLE_CLIENTS, Data: payload });
};

export const corporateDefaultOrder = (payload) => {
  console.log(payload)
  return HTTPRequest({ Method: "post", Url: DEFAULT_ORDER, Data: payload });
};
export const validateSession = (sessionId) => {
  return HTTPRequest({
    Method: "get",
    Url: SESSION + sessionId,
    Headers: {
      "Content-Type": "application/json-patch+json",
    },
  });
};
export const updateSession = (payload) => {
  return HTTPRequest({ Method: "put", Url: SESSION, Data: payload });
};

export const getCorporatePreset = (corporateId) => {
  return HTTPRequest({ Method: "get", Url: CORPORATE_PRESET + corporateId });
};
export const getBoothPreset = (boothId) => {
  return HTTPRequest({ Method: "get", Url: BOOTH_PRESET + boothId });
};

export const getBoothZoneSetting = (boothId) => {
  return HTTPRequest({ Method: "get", Url: BOOTH_ZONE_SETTINGS  });
};

export const dailyOrderCreate = (payload) => {
  console.log(payload)
  return HTTPRequest({ Method: "post", Url: DAILY_ORDER_CREATE, Data: payload });
};

export const clubOrderCreate = (payload) => {
  return HTTPRequest({ Method: "post", Url: CLUB_BOOTH_URL, Data: payload });
};
export const getClientLightZone = (clientId) => {
  return HTTPRequest({ Method: "get", Url: CLIENT_ZONE_SETTINGS+clientId, });
};