import axios from "axios";
// import logger from "./logServices";

// function setJwt(jwt) {
//   if (jwt) {
//     const user_token = JSON.parse(jwt).id_token;
//     axios.defaults.headers.common["Authorization"] = "Bearer " + user_token;
//   }
// }

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    // logger.log(error);
  }
  if (expectedError) {
    console.log(error.response.status);
  }

  return Promise.reject(error);
});

export const HTTPRequest = ({
  Method,
  Url,
  Data = {},
  Headers = { "Content-Type": "application/json" },
}) => {
  const token = localStorage.getItem("BootUser");
  let _header = Headers;
  if (token) {
    _header = {
      ...Headers,
      Authorization: "Bearer " + JSON.parse(token)?.id_token,
    };
  }
  return axios({
    method: Method,
    url: Url,
    data: Data,
    headers: _header,
  });
};

export default HTTPRequest;
