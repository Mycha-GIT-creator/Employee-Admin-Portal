using Employee_Admin_Portal.Models.Entities;
using MediatR;

namespace Employee_Admin_Portal.Features.Employees.Commands.PatchEmployee
{
    public class PatchEmployeeCommand : IRequest<Employee>
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public decimal? Salary { get; set; }

    }
}
