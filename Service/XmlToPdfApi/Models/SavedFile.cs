using Microsoft.AspNetCore.Identity;

namespace XmlToPdfApi.Models
{
    public class SavedFile
    {
        public int Id { get; set; }
        public IdentityUser User { get; set; }
        public string UniqueFileName { get; set; }
        public string FileName { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
