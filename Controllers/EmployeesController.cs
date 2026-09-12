using Employee_Admin_Portal.Features.Employees.Commands.AddEmployee;
using Employee_Admin_Portal.Features.Employees.Commands.DeleteEmployee;
using Employee_Admin_Portal.Features.Employees.Commands.PatchEmployee;
using Employee_Admin_Portal.Features.Employees.Commands.UpdateEmployee;
using Employee_Admin_Portal.Features.Employees.Queries.GetAllEmployees;
using Employee_Admin_Portal.Features.Employees.Queries.GetEmployeeById;
using Employee_Admin_Portal.Features.Employees.Queries.SearchEmployees;
using MediatR;
using Microsoft.AspNetCore.Mvc;


namespace Employee_Admin_Portal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly IMediator mediator;

        public EmployeesController(IMediator mediator)
        {
            this.mediator = mediator;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllEmployees()
        {
            var result = await mediator.Send(new GetAllEmployeesQuery());
            return Ok(result);
        }

        [HttpGet]
        [Route("search")]
        public async Task<IActionResult> SearchEmployees(string? name, decimal? minSalary, decimal? maxSalary)
        {
            var result = await mediator.Send(new SearchEmployeesQuery
            {
                NameFilter = name,
                MinSalary = minSalary,
                MaxSalary = maxSalary
            });
            return Ok(result);
        }

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetEmployeeById(Guid id)
        {
            var result = await mediator.Send(new GetEmployeeByIdQuery(id));
            if (result is null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployee(AddEmployeeCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateEmployee(Guid id, UpdateEmployeeCommand command)
        {
            command.Id = id;
            var result = await mediator.Send(command);
            if (result is null) return NotFound();
            return Ok(result);
        }

        [HttpPatch]
        [Route("{id:guid}")]
        public async Task<IActionResult> PatchEmployee(Guid id, PatchEmployeeCommand command)
        {
            command.Id = id;
            var result = await mediator.Send(command);
            if (result is null) return NotFound();
            return Ok(result);
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteEmployee(Guid id)
        {
            var result = await mediator.Send(new DeleteEmployeeCommand(id));
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
