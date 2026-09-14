using MediatR;

namespace Employee_Admin_Portal.Features.Auth.Login
{
    public class LoginCommand : IRequest<string?>
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}