using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using XmlToPdfApi.Models;
using XmlToPdfApi.Models.Requests;
using XmlToPdfApi.Models.Responses;

namespace XmlToPdfApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public partial class FileController: ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly UserDbContext _userDbContext;

        public FileController(UserManager<IdentityUser> userManager, UserDbContext userDbContext)
        {
            _userManager = userManager;
            _userDbContext = userDbContext;
        }
        [HttpPost]
        public async Task<ActionResult> SaveXmlFile(XmlFileRequest xmlString)
        {
            if (string.IsNullOrEmpty(xmlString.xmlData) || string.IsNullOrEmpty(xmlString.fileName))
            {
                return BadRequest("Invalid XML data or file name.");
            }

            var user = await _userManager.GetUserAsync(User);
            var userId = user.Id;
            var folderPath = Path.Combine("database", "files", userId);
            Directory.CreateDirectory(folderPath);

            var newGuid = Guid.NewGuid();
            var uniqueFileName = $"{newGuid}.xml";
            var filePath = Path.Combine(folderPath, uniqueFileName);

            try
            {
                var xmlData = XDocument.Parse(xmlString.xmlData);
                xmlData.Save(filePath);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error saving the XML file: {ex.Message}");
            }

            var userFile = new SavedFile
            {
                User = user,
                FileName = xmlString.fileName,
                UniqueFileName = uniqueFileName,
                CreatedOn = DateTime.UtcNow
            };

            _userDbContext.SavedFiles.Add(userFile);
            await _userDbContext.SaveChangesAsync();

            return Ok();
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SavedFile>>> GetUserFiles()
        {
            var test = _userManager.GetUserId(User);
            var user = await _userManager.GetUserAsync(User);
            var userId = user.Id;
            var userFiles = _userDbContext.SavedFiles.Where(uf => uf.User.Id == userId).ToList();

            return Ok(userFiles);
        }

        [HttpGet("{uniqueFileName}")]
        public async Task<ActionResult> GetUserFile(string uniqueFileName)
        {
            var user = await _userManager.GetUserAsync(User);
            var userId = user.Id;
            var userFile = _userDbContext.SavedFiles.FirstOrDefault(uf => uf.User.Id == userId && uf.UniqueFileName == uniqueFileName);

            if (userFile == null)
            {
                return NotFound("File not found.");
            }

            var folderPath = Path.Combine("database", "files", userId);
            var filePath = Path.Combine(folderPath, uniqueFileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File not found on the server.");
            }

            var fileContent = await System.IO.File.ReadAllTextAsync(filePath);
            return new JsonResult(new SavedFileResponse() {
                FileContent = fileContent,
                FileData = userFile
            });
        }
        [HttpPut("{uniqueFileName}")]
        [Authorize]
        public async Task<ActionResult> UpdateUserFile(string uniqueFileName, [FromBody] XmlFileRequest xmlString)
        {
            if (string.IsNullOrEmpty(xmlString.xmlData) || string.IsNullOrEmpty(xmlString.fileName))
            {
                return BadRequest("Invalid XML data or file name.");
            }

            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return Unauthorized();
            }

            var userId = user.Id;
            var userFile = _userDbContext.SavedFiles.FirstOrDefault(uf => uf.User.Id == userId && uf.UniqueFileName == uniqueFileName);

            if (userFile == null)
            {
                return NotFound("File not found.");
            }

            var folderPath = Path.Combine("database", "files", userId);
            var filePath = Path.Combine(folderPath, uniqueFileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File not found on the server.");
            }

            try
            {
                var xmlData = XDocument.Parse(xmlString.xmlData);
                xmlData.Save(filePath);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating the XML file: {ex.Message}");
            }

            userFile.FileName = xmlString.fileName;
            _userDbContext.SavedFiles.Update(userFile);
            await _userDbContext.SaveChangesAsync();

            return Ok();
        }
        [HttpDelete("{fileId}")]
        [Authorize]
        public async Task<ActionResult> DeleteUserFile(string fileId)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return Unauthorized();
            }

            var userId = user.Id;
            var userFile = _userDbContext.SavedFiles.FirstOrDefault(uf => uf.User.Id == userId && uf.UniqueFileName == fileId);

            if (userFile == null)
            {
                return NotFound("File not found.");
            }

            var folderPath = Path.Combine("database", "files", userId);
            var filePath = Path.Combine(folderPath, fileId);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File not found on the server.");
            }

            try
            {
                System.IO.File.Delete(filePath);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error deleting the XML file: {ex.Message}");
            }

            _userDbContext.SavedFiles.Remove(userFile);
            await _userDbContext.SaveChangesAsync();

            return Ok();
        }

    }
}
