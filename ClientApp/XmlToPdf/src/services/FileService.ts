import { FetchUtils, PopupUtils, useToken } from '@/utils';
class FileService {
    public static async PostFile(fileName: string, xmlData: string): Promise<any | null> {
        try {
          const data: any = await FetchUtils.makeApiCall("api/file", 
            { 
              fileName: fileName,
              xmlData: xmlData
            }, 
            "POST", "BASIC");
          return data;
        } catch (message) {
          PopupUtils.error(message as string);
        }
        return null;
    };  
    public static async PutFile(fileId: string, fileName: string, xmlData: string): Promise<any | null> {
      try {
        const data: any = await FetchUtils.makeApiCall("api/file/" + fileId, 
          { 
            fileName: fileName,
            xmlData: xmlData
          }, 
          "PUT", "BASIC");
        return data;
      } catch (message) {
        PopupUtils.error(message as string);
      }
      return null;
    };
    public static async DeleteFile(fileId: string): Promise<any | null> {
      try {
        const data: any = await FetchUtils.makeApiCall("api/file/" + fileId, {}, "DELETE", "BASIC");
        return data;
      } catch (message) {
        PopupUtils.error(message as string);
      }
      return null;
    };  
    public static async GetFile(fileId: string | null = null): Promise<any | null> {
      try {
        let data: any;
        if (fileId) {
          data = await FetchUtils.makeApiCall("api/file/" + fileId, {}, "GET");
        } else {
          data = await FetchUtils.makeApiCall("api/file", {}, "GET");
        }
        return data;
      } catch (message) {
        PopupUtils.error(message as string);
      }
      return null;
    }; 
}
export default FileService;