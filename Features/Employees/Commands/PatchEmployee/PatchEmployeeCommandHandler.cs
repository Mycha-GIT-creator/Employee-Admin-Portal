using Employee_Admin_Portal.Data;
using Employee_Admin_Portal.Models.Entities;
using MediatR;

namespace Employee_Admin_Portal.Features.Employees.Commands.PatchEmployee
{
    public class PatchEmployeeCommandHandler : IRequestHandler<PatchEmployeeCommand, Employee?>
    {
        private readonly ApplicationDbContext dbContext;

        public PatchEmployeeCommandHandler(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Employee?> Handle(PatchEmployeeCommand request, CancellationToken cancellationToken)
        {
            var employee = await dbContext.Employees.FindAsync(new object[] { request.Id }, cancellationToken);

            if (employee is null)
            {
                return null;
            }

            if (request.Name is not null)
            {
                employee.Name = request.Name;
            }
            if (request.Email is not null)
            {
                employee.Email = request.Email;
            }
            if (request.Phone is not null)
            {
                employee.Phone = request.Phone;
            }
            if (request.Salary.HasValue)
            {
                employee.Salary = request.Salary.Value;
            }

            await dbContext.SaveChangesAsync(cancellationToken);

            return employee;
        }
    }
}
