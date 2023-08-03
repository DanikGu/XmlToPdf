import React, { useState } from 'react';
import XMLParser from 'react-xml-parser'
import { JsonTree } from 'react-editable-json-tree';
import '../styles/TreeViewStyles.css'
import okButtonIcon from '/checkmark-outline.svg'
import cancleButtonIcon from '/close-outline.svg'
import addButtonIcon from '/add-outline.svg'
import { Utils } from '@/utils';
interface FoTreeViewProps {
    xml: string;
    onXmlChange: (xml: string) => void;
}
const FoTreeView = (props: FoTreeViewProps) =>  {
    let xmlObjectInitial = new XMLParser().parseFromString(props.xml);
    const [xmlObject] = useState(xmlObjectInitial);

    const onUpdate = (xmlObject: any) => {
        let xml = new XMLParser().toString(xmlObject);
        props.onXmlChange(Utils.prettifyXml(xml));
    }
    const removeNotViewedFields = (object: any) => {
        Utils.deletePropertyByName(object, "getElementsByTagName");
        return object; 
    }
    return (
        <>
            <JsonTree 
                data={removeNotViewedFields(xmlObject)}
                rootName = "document"
                editButtonElement = {<button className='treeButton'><img src={okButtonIcon}/></button>}
                cancelButtonElement = {<button className='treeButton'><img src={cancleButtonIcon}/></button>}
                addButtonElement = {<button className='treeButton'><img src={addButtonIcon}/></button>}
                onDeltaUpdate = {onUpdate}
                onFullyUpdate = {onUpdate}
                readOnly = { false }
            >
            </JsonTree>
        </>
    )
}

export default FoTreeView;
