using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace XmlToPdfApi.ConfigurationExstensions
{
    public static class AddIdentityExstension
    {
        public static IServiceCollection AddIdentity(this IServiceCollection services)
        {
            services
                .AddIdentityCore<IdentityUser>(options => {
                    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
                    options.SignIn.RequireConfirmedEmail = false;
                    options.User.RequireUniqueEmail = true;
                    options.SignIn.RequireConfirmedAccount = false;
                    options.Password.RequireDigit = false;
                    options.Password.RequiredLength = 6;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireLowercase = false;
                })
                .AddEntityFrameworkStores<UserDbContext>();
            return services;
        }
    }
}
