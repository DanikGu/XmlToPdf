import { FetchUtils, PopupUtils, useToken } from '@/utils';

type TokenPayload = {
    token: string;
    expiration: Date;
};

class LoginService {
    public static async GetAuthToken(userName: string, password: string): Promise<TokenPayload | null> {
        try {
          const data: any = await FetchUtils.makeApiCall("api/users/BearerToken", { userName, password });
          
          if (data?.token && data?.expiration) {
            return  {
              token: data?.token,
              expiration: data?.expiration
            }
          }
        } catch (message) {
          PopupUtils.error(message as string);
        }
        return null;
    };  
    public static async CreateUserAndGetAuthToken(userName: string, password: string): Promise<TokenPayload | null> {
      try {
        await FetchUtils.makeApiCall("api/users", { userName, password });
        const data: any = await FetchUtils.makeApiCall("api/users/BearerToken", { userName, password });
        
        if (data?.token && data?.expiration) {
          return  {
            token: data?.token,
            expiration: data?.expiration
          }
        }
      } catch (message) {
        PopupUtils.error(message as string);
      }
      return null;
  };
  
}
export default LoginService;