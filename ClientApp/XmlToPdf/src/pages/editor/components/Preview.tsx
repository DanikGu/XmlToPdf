import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, HtmlHTMLAttributes } from 'react';
import styleSheet from '../constants/XmlToHtmlXslStyleSheet';
import previewFrameCss from '../styles/previewFrame.css?raw';
import { useSelector } from 'react-redux';
import { selectXmlFo } from '@/reduxConfig/xmlSlice';

interface PreviewProps {
    previewScale: React.Ref<number>
}

const Preview = forwardRef((props: PreviewProps, ref) => {
    const { previewScale } = props;
    const [previewHtml, setPreviewHtml] = useState('');
    const xmlFo = useSelector(selectXmlFo);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    useEffect(() => {
        let htmlDocument = convertXmlStringHtmlDocument(xmlFo);
        let htmlString = new XMLSerializer().serializeToString(htmlDocument);
        setPreviewHtml(htmlString);
    }, [xmlFo]);

    const convertXmlStringHtmlDocument = (xml: string) => {
        let result;
        result = new XSLTProcessor();
        result.importStylesheet(getXMLDocument(styleSheet));
        let xmlDocument = getXMLDocument(xml);
        result = result.transformToDocument(xmlDocument);
        result.head.appendChild(getPreviewCSS(xmlDocument));
        result.body.appendChild(getPreviewScript());
        prepareDocument(result);
        return result;
    }

    const prepareDocument = (document: Document) => {
        const firstBrElement = document.querySelector('br');
        if (firstBrElement) {
            firstBrElement.remove();
        }
    }

    const getPreviewCSS = (xml: Document) => {
        const style = document.createElement('style');
        const simplePageMaster = xml.querySelector('simple-page-master');
        const margin = simplePageMaster?.getAttribute('margin');
        let rootVariables = `
            :root {
                --scale: ${1};
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
    const getPreviewScript = () => {
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
    const getXMLDocument = (xml: string) => {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xml, "application/xml");
        return xmlDoc;
    }
    useImperativeHandle(ref, () => ({
       updatePreviewScale(newPreviewScale: number) {
            let frame = iframeRef.current;
            if (frame?.contentWindow) {
                frame.contentWindow.postMessage(newPreviewScale, '*');
            }
        }   
    }));

    return (
        <div className="preview">
            {
                (previewHtml?.length ?? 0) > 0 && 
                ( <iframe ref={iframeRef} srcDoc={previewHtml}></iframe> )
            }
        </div>
    );
});

export default Preview;