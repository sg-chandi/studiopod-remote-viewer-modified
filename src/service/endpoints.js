const localGlobalConstants = {
  BASE_URL: "http://localhost:62275",
  BASE_URL_PAYMENT: "http://localhost:62275",
  PAYMENT_KEY: "pk_test_UxB6ye7JNe146OdX6yQZarxj00ovJZUfQ4",
  BASE_MESSAGE: "Local",
};

const testingGlobalConstants = {
  BASE_URL: "https://m05cdrbl-62275.inc1.devtunnels.ms",
  // BASE_URL: "https://staging.thestudiopod.com",
  BASE_URL_PAYMENT: "https://staging.thestudiopod.com",
  PAYMENT_KEY: "pk_test_UxB6ye7JNe146OdX6yQZarxj00ovJZUfQ4",
  BASE_MESSAGE: "Testing",
};

const productionGlobalConstants = {
  BASE_URL: "https://apibooth.thestudiopod.com",
  BASE_URL_PAYMENT: "https://apibooth.thestudiopod.com",
  PAYMENT_KEY: "pk_live_3mLWtq9iDblgKjRi3gOBEhex00C9QyjDkb",
  BASE_MESSAGE: "Production",
};
let config = testingGlobalConstants;
if (process.env.REACT_APP_ENV === "production") {
  config = productionGlobalConstants;
} else if (process.env.REACT_APP_ENV === "staging") {
  config = testingGlobalConstants;
}

export const globalConstants = {
  // Add common config values here
  URL_INITIAL: "/api",
  VERSION: "2.0.2",
  ...config,
};
export const API_BASE_URL = "http://18.191.254.55:8083/api/";
export const LIVE_VIEW_BASE_URL = "http://localhost:5002/liveimages/";
export const PHOTO_SESSION_BASEURL = "http://localhost:5002/photosessions/";
export const SIGNAL_R_CONNECTION = "http://localhost:5000/chat?cl=webclient";
export const API_PAYMENT = "http://18.191.254.55:8083";
const INVITE = "invites";
export const API_BASEURL =
  globalConstants.BASE_URL + globalConstants.URL_INITIAL;

export const SESSION = API_BASEURL + "/ex/sessions/";
export const AUTHENTICATE = API_BASEURL + "/authenticate";
export const AVAILABLE_CLIENTS =
  API_BASEURL + "/corporate-orders/available-clients";
export const DEFAULT_ORDER = API_BASEURL + "/corporate-orders/corporate";
export const BOOTH_PRESET = API_BASEURL + "/Booths/photoactions/";
export const CORPORATE_PRESET =
  API_BASEURL + "/corporate-clients/photoactions/";
export const BOOTH_ZONE_SETTINGS = API_BASEURL + "/Booths/zonesetting/";
export const ORDER_URL = API_BASEURL + "/corporate-orders/booth";
export const SESSION_VALIDATE =
  API_BASEURL + "/sessions/GetSessionDetailsByInviteData";
export const DAILY_ORDER_CREATE = API_BASEURL + "/corporate-orders/daily";
export const CLUB_BOOTH_URL = API_BASEURL + "/corporate-orders/club";
export const CLIENT_ZONE_SETTINGS =
  API_BASEURL + "/corporate-clients/zonesetting/";

export const BOOTH_DATA = API_BASEURL + "/Booths?boothEmail.equals=";
export const BOOTH_ORDER = API_BASEURL + "/corporate-orders/booth";
export const TRANSACTION_URL = API_BASEURL + "/transaxtions";
export const ACCOUNT = API_BASEURL + "/Account";
export const DISCOUNT_VALIDATION = API_BASEURL + "/discount/GetDiscountDetails";
export const ACTIVE_CODE = API_BASEURL + "/discount/GetActiveDiscount";
export const BOOTH_DAILY_MODE = API_BASEURL + "/Booths/IsBoothInDailyMode";

export const TRANSACTION_CHECKOUT = API_BASEURL + "/transaxtions/checkout";

export const TAX_DETAIL = API_BASEURL + "/TaxDetail/GetTaxDetail/0";

export const BOOTH_DETAILS = (userId) =>
  API_BASEURL + `/users/GetBoothByUserId?UserId=${userId}`;
