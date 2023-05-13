using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using XmlToPdfApi.Models;

namespace XmlToPdfApi
{
    public class UserDbContext : IdentityUserContext<IdentityUser>
    {
        public UserDbContext(DbContextOptions<UserDbContext>  options): base(options) {

        }
        public DbSet<SavedFile> SavedFiles { get; set; }
    }
}
