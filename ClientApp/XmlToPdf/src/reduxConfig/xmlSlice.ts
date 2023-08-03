import { createSlice } from '@reduxjs/toolkit';
import helloWorldXml from '@/pages/editor/constants/helloFoObjectTemplate';
export const xmlSlice = createSlice({
  name: 'xml',
  initialState: {
    xml: '',
    xsl: '',
    xmlFo: helloWorldXml,
  },
  reducers: {
    setXml: (state, action) => {
      state.xml = action.payload;
    },
    setXsl: (state, action) => {
      state.xsl = action.payload;
    },
    setXmlFo: (state, action) => {
      state.xmlFo = action.payload;
    },
  },
});

export const { setXml, setXsl, setXmlFo } = xmlSlice.actions;

export const selectXml = (state: any) => state.xml.xml;
export const selectXsl = (state: any) => state.xml.xsl;
export const selectXmlFo = (state: any) => state.xml.xmlFo;

export default xmlSlice.reducer;