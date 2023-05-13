namespace XmlToPdfApi.Controllers
{
    public partial class FileController
    {
        public record XmlFileRequest(string fileName, string xmlData);

    }
}
