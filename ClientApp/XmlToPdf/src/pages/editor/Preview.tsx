import React from 'react';
import styleSeet from './constants/XmlToHtmlXslStyleSheet';
import previewFrameCss from './styles/previewFrame.css?raw';

interface PreviewProps {
    previewScale: number;
    editorXml: string
}
interface PreviewState {
    previewHtml: string;
    previewScale: number;
}

class Preview extends React.Component<PreviewProps, PreviewState> {
    constructor (props:PreviewProps) {
        super(props);
        let htmlDocument = this.convertXmlStringHtmlDocument(props.editorXml);
        let htmlString = new XMLSerializer().serializeToString(htmlDocument);
        this.state = {
            previewHtml: htmlString,
            previewScale: props.previewScale
        }
    }
    convertXmlStringHtmlDocument(xml: any) {
        let result: any;
        result = new XSLTProcessor();
        result.importStylesheet(this.getXMLDocument(styleSeet));
        let xmlDocument = this.getXMLDocument(xml);
        result = result.transformToDocument(xmlDocument);
        result.head.appendChild(this.getPreviewCSS(xmlDocument));
        result.body.appendChild(this.getPreviewScript());
        this.prepareDocument(result);
        return result;
    }

    prepareDocument(document: Document) {
        const firstBrElement = document.querySelector('br');
        if (firstBrElement) {
            firstBrElement.remove();
        }
    }

    getPreviewCSS(xml: Document) {
        const style = document.createElement('style');
        const simplePageMaster = xml.querySelector('simple-page-master');
        const margin = simplePageMaster?.getAttribute('margin');
        let rootVariables = `
            :root {
                --scale: ${this.props.previewScale};
                --width: ${simplePageMaster?.getAttribute('page-width') ?? 0};
                --height: ${simplePageMaster?.getAttribute('page-height') ?? 0};
                --padding-top: ${simplePageMaster?.getAttribute('margin-top') ?? margin ?? 0};
                --padding-left: ${simplePageMaster?.getAttribute('margin-left') ?? margin ?? 0};
                --padding-right: ${simplePageMaster?.getAttribute('margin-right') ?? margin ?? 0};
            }
        `;
        style.textContent = rootVariables + previewFrameCss;
        style.type = "text/css";
        return style;
    }

    getPreviewScript() {
        const script = document.createElement('script');
        var currentOrigin = window.location.origin;
        let javaScript = `window.addEventListener('message', function(event) {
            if (event.origin === '${currentOrigin}') {
                let frameRoot = document.querySelector(':root');
                frameRoot.style.setProperty('--scale', event.data);
            } else {
                return;
            }
        });`;
        script.textContent = javaScript;
        return script;
    }

    getXMLDocument(xml: string) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xml, "application/xml");
        return xmlDoc;
    }
    updatePreview(xml: any) {
        let htmlDocument = this.convertXmlStringHtmlDocument(xml);
        let htmlString = new XMLSerializer().serializeToString(htmlDocument);
        this.setState({previewHtml: htmlString})
    }
    zoom(step: number) {
        let newScale = this.state.previewScale + step; 
        let frame = document.getElementById('previewFrame') as any;
        frame.contentWindow.postMessage(newScale, '*');
        this.setState( { previewScale: newScale } );
    }
    render() {  
      return (
        <div className="preview">
          {
            (this.state?.previewHtml?.length ?? 0) > 0 && 
            ( <iframe id="previewFrame" srcDoc={this.state.previewHtml}></iframe> )
          }
        </div>
      );
    }
}

export default Preview;