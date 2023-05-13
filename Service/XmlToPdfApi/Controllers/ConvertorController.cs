using ibex4;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Xml;
using XmlToPdfApi.Models.Requests;

namespace XmlToPdfApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConvertorController : ControllerBase
    {
        [Authorize]
        [HttpPost]
        public async Task<ActionResult> Convert(XmlStringRequest request)
        {
            try
            {
                byte[] pdfData;
                FODocument doc = new FODocument();
                using (var outputStream = new MemoryStream())
                {
                    using (var inputStream = new MemoryStream()) {
                        XmlDocument xmlDocument = new XmlDocument();
                        xmlDocument.LoadXml(request.xmlData);
                        xmlDocument.Save(inputStream);
                        doc.generate(inputStream, PDFStream: outputStream);
                    }
                    pdfData = outputStream.ToArray();
                }
                return File(pdfData, "application/pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
