import PopupUtils from "./PopupUtils";

const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString ?? '{}');
    if (userToken.expiration && 
      new Date(userToken.expiration) < new Date()) {
      return null;
    }
    return userToken?.token
  };
class FetchUtils {
    public static makeApiCall(path: string, body: any, method: string = "POST", responseType: string = "JSON") {
        const token = getToken();
        let headers = new Headers({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        if (token) {
            headers.set("Authorization", 'Bearer ' + token);
        }
        return new Promise((resolve, rejectRequest) => {
            fetch(path, {
                method: method,
                body: method === "GET" ? null : JSON.stringify(body),
                headers: headers
              })
            .then(async (response) => {
                let error;
                switch (response.status) {
                    case 200:
                    case 201:
                        switch (responseType) {
                            case "JSON":
                                return response.json();
                            case "BLOB":
                                return response.blob();
                            case "BASIC":
                                return {}
                            default:
                                throw new DOMException("Not supported response type")
                        }
                        break;
                    case 400:
                        let getContentTypeIs = (type: string) => response.headers.get("content-type")?.includes(type);
                        if (getContentTypeIs("application/json")) {
                            let res = await response.json();
                            if (res && res[0] && res[0].description) {
                                rejectRequest(res[0].description);
                            } else {
                                rejectRequest("Validation error")
                            }
                            
                        } else if (getContentTypeIs("text/plain")) {
                            let res = await response.text();
                            rejectRequest(res);
                            
                        }
                        break;
                    case 401:
                        error = "Unauthorized request";
                        break;
                    case 403:
                        error = "Access is forbidden to the requested resource";
                        break;
                    case 404:
                        error = "API not found";
                        break;
                    case 500:
                        error = "Internal Server Error";
                        break;
                    case 503:
                        error = "Service Unavailable";
                        break;
                    default:
                        error = `Unhandled status code: ${response.status}`;
                        
                }
                if (error) {
                    rejectRequest(error);
                }
            })
            .then((data) => {
                if (process.env.NODE_ENV === "development") {
                    console.log({
                        request: body,
                        response: data
                    });
                }
                resolve(data);
            })
            .catch((err) => {
                if(err.message) {
                    rejectRequest(err.message);
                }
            })
        });
    }
}
export default FetchUtils;