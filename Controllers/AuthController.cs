using Employee_Admin_Portal.Data;
using Employee_Admin_Portal.Features.Auth.Login;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Employee_Admin_Portal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMediator mediator;

        public AuthController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var token = await mediator.Send(new LoginCommand
            {
                Username = request.Username,
                Password = request.Password
            });

            if (token is null)
            {
                return Unauthorized("Invalid username or password");
            }

            return Ok(new LoginResponse { Token = token });
        }
    }
}