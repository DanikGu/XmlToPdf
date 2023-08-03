using ibex4;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Xml;
using System.Xml.Xsl;
using XmlToPdfApi.Models.Requests;

namespace XmlToPdfApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConvertorController : ControllerBase
    {
        [Authorize]
        [HttpPost("Convert")]
        public async Task<ActionResult> ConvertXmlFoToPdf(XmlStringRequest request)
        {
            try 
            { 
                byte[] pdfData;
                FODocument doc = new FODocument();

                using (var inputStream = new MemoryStream())
                using (var outputStream = new MemoryStream())
                {
                    XmlDocument xmlDocument = new XmlDocument();
                    xmlDocument.LoadXml(request.xmlData);
                    xmlDocument.Save(inputStream);
                    doc.generate(inputStream, PDFStream: outputStream);
                    pdfData = outputStream.ToArray();
                }

                return File(pdfData, "application/pdf");
            } 
            catch (Exception ex) when (typeof(XmlException) == ex.GetType()) 
            {
                return BadRequest("Invalid xml");
            }
            catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }
        [Authorize]
        [HttpPost("ApplyXsl")]
        public async Task<ActionResult> ApplyXslToXml(XslAndXmlStringRequest request)
        {
            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(request.xmlData);
                XslCompiledTransform myXslTrans = new XslCompiledTransform();
                var result = new StringBuilder();

                using (var stream = new MemoryStream())
                using (var writer = new StreamWriter(stream))
                using (var reader = XmlReader.Create(stream, new XmlReaderSettings()))
                using (var strWriter = new StringWriter(result))
                {
                    writer.Write(request.xslData);
                    myXslTrans.Load(reader);
                    myXslTrans.Transform(xmlDoc, null, strWriter);
                }

                return Ok(result);
            }
            catch (Exception ex) when (typeof(XmlException) == ex.GetType())
            {
                return BadRequest("Invalid xml");
            }
            catch (Exception ex) when (typeof(XsltException) == ex.GetType()) {
                return BadRequest("Error when transforming");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
