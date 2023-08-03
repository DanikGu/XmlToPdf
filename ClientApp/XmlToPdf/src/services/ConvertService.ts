import { FetchUtils, PopupUtils } from "@/utils";

class ConvertService {
    public static async ConvertToPdf(xmlData: string): Promise<any | null> {
        try {
          const data: any = await FetchUtils.makeApiCall("api/Convertor/Convert", { xmlData: xmlData.trim()}, "POST", "BLOB")
          return data;
        } catch (message) {
          PopupUtils.error(message as string);
        }
        return null;
    };  
}
export default ConvertService