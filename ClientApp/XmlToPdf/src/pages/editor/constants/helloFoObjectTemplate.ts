const ex = `<fo:root xmlns:fo="http://www.w3.org/1999/XSL/Format">
<fo:layout-master-set>
<fo:simple-page-master master-name="a4-default"
                       page-height="29.7cm"
                       page-width="21cm"
                       margin="1cm">
   <fo:region-body />
</fo:simple-page-master>
</fo:layout-master-set>
<fo:page-sequence master-reference="a4-default">
 <fo:flow flow-name="xsl-region-body">
  <fo:block>Hello world!</fo:block>
 </fo:flow>
</fo:page-sequence>
</fo:root>`;
export default ex;