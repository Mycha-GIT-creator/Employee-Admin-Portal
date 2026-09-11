using Employee_Admin_Portal.Data;
using Employee_Admin_Portal.Models.Entities;
using MediatR;

namespace Employee_Admin_Portal.Features.Employees.Commands.UpdateEmployee
{
    public class UpdateEmployeeCommandHandler : IRequestHandler<UpdateEmployeeCommand, Employee?>
    {
        private readonly ApplicationDbContext dbContext;

        public UpdateEmployeeCommandHandler(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Employee?> Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
        {
            var employee = await dbContext.Employees.FindAsync(new object[] { request.Id }, cancellationToken);

            if (employee is null)
            {
                return null;
            }

            employee.Name = request.Name;
            employee.Email = request.Email;
            employee.Phone = request.Phone;
            employee.Salary = request.Salary;

            await dbContext.SaveChangesAsync(cancellationToken);

            return employee;
        }   
    }
}
