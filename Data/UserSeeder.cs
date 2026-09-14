using Employee_Admin_Portal.Models.Entities;

namespace Employee_Admin_Portal.Data
{
    public static class UserSeeder
    {
        public static void SeedAdminUser(ApplicationDbContext dbContext)
        {
            if (!dbContext.Users.Any())
            {
                dbContext.Users.Add(new User
                {
                    Id = Guid.NewGuid(),
                    Username = "admin",
                    PasswordHash = PasswordHasher.Hash("Admin123!")
                });
                dbContext.SaveChanges();
            }
        }
    }
}