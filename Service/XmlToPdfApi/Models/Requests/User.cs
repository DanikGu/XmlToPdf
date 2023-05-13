using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace XmlToPdfApi.Models.Requests
{
    public class User
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
