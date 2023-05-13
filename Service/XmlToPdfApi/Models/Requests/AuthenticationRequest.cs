using System.ComponentModel.DataAnnotations;

namespace XmlToPdfApi.Models.Requests
{
    public class AuthenticationRequest
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
