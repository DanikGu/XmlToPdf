import PopupUtils from "./PopupUtils";

class Utils {
    public static DownloadFile(blob: any, fileName: string): void {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a); 
        a.click();    
        a.remove();
    }
    public static deletePropertyByName(obj: any, propName: string, depth = 0) {
        if (typeof obj !== 'object' || obj === null) {
          return;
        }
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if(key === propName) {
                delete obj[key]
            } else if (typeof value === 'object' && value !== null) {
                Utils.deletePropertyByName(value, propName, depth + 1);
            }
          }
        }
    }
    public static prettifyXml = (sourceXml: any) => {
        var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
        var xsltDoc = new DOMParser().parseFromString([
            // describes how we want to modify the XML - indent everything
            '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
            '  <xsl:strip-space elements="*"/>',
            '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
            '    <xsl:value-of select="normalize-space(.)"/>',
            '  </xsl:template>',
            '  <xsl:template match="node()|@*">',
            '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
            '  </xsl:template>',
            '  <xsl:output indent="yes"/>',
            '</xsl:stylesheet>',
        ].join('\n'), 'application/xml');

        var xsltProcessor = new XSLTProcessor();    
        xsltProcessor.importStylesheet(xsltDoc);
        var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
        var resultXml = new XMLSerializer().serializeToString(resultDoc);
        return resultXml;
    };
    public static applyXslToXml(xml: string, xsl: string) {
        try
        {
            const xmlDoc = new DOMParser().parseFromString(xml, 'application/xml');
            const xslDoc = new DOMParser().parseFromString(xsl, 'application/xml');
  
            const processor = new XSLTProcessor();
            processor.importStylesheet(xslDoc);
  
            const resultDoc = processor.transformToDocument(xmlDoc);
            const resultText = new XMLSerializer().serializeToString(resultDoc);
  
            return resultText;
        } catch (error: any) {
            PopupUtils.alert(`Error processing the files: ${error.message}`);
        }
    }
}
export default Utils;