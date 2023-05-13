import React from 'react';
import XMLParser  from 'react-xml-parser'
import { JsonTree } from 'react-editable-json-tree';
import './styles/TreeViewStyles.css'
import okButtonIcon from '/checkmark-outline.svg'
import cancleButtonIcon from '/close-outline.svg'
import addButtonIcon from '/add-outline.svg'
interface FoTreeViewProps {
    xml: string;
    onXmlChange: (xml: string) => void;
}
interface FoTreeViewState {
    xmlObject: any
}


class FoTreeView extends React.Component<FoTreeViewProps, FoTreeViewState> {
    constructor(props: FoTreeViewProps) {
        super(props);
        let xmlObject = new XMLParser().parseFromString(this.props.xml);
        this.state = {
            xmlObject: xmlObject
        }
        this.onUpdate = this.onUpdate.bind(this); 
    }
    onUpdate(xmlObject: any) {
        let xml = new XMLParser().toString(xmlObject);
        this.props.onXmlChange(this.prettifyXml(xml));
    }
    removeNotViewedFields(object: any) {
        //remove all functions
        this.deletePropertyByName(object, "getElementsByTagName");
        return object; 
    }
    deletePropertyByName(obj: any, propName: string, depth = 0) {
        if (typeof obj !== 'object' || obj === null) {
          return;
        }
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if(key === propName) {
                delete obj[key]
            } else if (typeof value === 'object' && value !== null) {
              this.deletePropertyByName(value, propName, depth + 1);
            }
          }
        }
    }
    prettifyXml(sourceXml: string)
    {
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

      
    render() {
        return (<div>
                <JsonTree 
                    data={this.removeNotViewedFields(this.state.xmlObject)}
                    rootName = "document"
                    editButtonElement = {<button className='treeButton'><img src={okButtonIcon}/></button>}
                    cancelButtonElement = {<button className='treeButton'><img src={cancleButtonIcon}/></button>}
                    addButtonElement = {<button className='treeButton'><img src={addButtonIcon}/></button>}
                    onDeltaUpdate = {this.onUpdate}
                    onFullyUpdate = {this.onUpdate}
                    readOnly = { false }
                 >
                </JsonTree>
            </div>
        )
    }
}
export default FoTreeView;