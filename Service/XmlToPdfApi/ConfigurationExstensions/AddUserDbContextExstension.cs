using Microsoft.EntityFrameworkCore;

namespace XmlToPdfApi.ConfigurationExstensions
{
    public static class AddUserDbContextExstension
    {

        public static IServiceCollection AddUserDbContext(this IServiceCollection services, WebApplicationBuilder builder) {

            var connectionString = builder.Configuration.GetConnectionString("Default") ?? 
                throw new ArgumentNullException("Connections tring do not provided");
            services.AddDbContext<UserDbContext>(options => options.UseSqlite(connectionString));
            return services;
        }
    }
}
