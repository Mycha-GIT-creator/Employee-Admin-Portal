using Employee_Admin_Portal.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Employee_Admin_Portal.Features.Auth.Login
{
    public class LoginCommandHandler : IRequestHandler<LoginCommand, string?>
    {
        private readonly ApplicationDbContext dbContext;
        private readonly JwtTokenGenerator tokenGenerator;

        public LoginCommandHandler(ApplicationDbContext dbContext, JwtTokenGenerator tokenGenerator)
        {
            this.dbContext = dbContext;
            this.tokenGenerator = tokenGenerator;
        }

        public async Task<string?> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);

            if (user is null || !PasswordHasher.Verify(request.Password, user.PasswordHash))
            {
                return null;
            }

            return tokenGenerator.GenerateToken(user.Username);
        }
    }
}