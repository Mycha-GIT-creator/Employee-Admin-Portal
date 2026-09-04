using Employee_Admin_Portal.Data;
using Employee_Admin_Portal.Models.Entities;
using MediatR;

namespace Employee_Admin_Portal.Features.Employees.Commands.AddEmployee
{
    public class AddEmployeeCommandHandler : IRequestHandler<AddEmployeeCommand, Employee>
    {
        private readonly ApplicationDbContext dbContext;

        public AddEmployeeCommandHandler(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Employee> Handle(AddEmployeeCommand request, CancellationToken cancellationToken)
        {
            var employeeEntity = new Employee
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Salary = request.Salary
            };

            dbContext.Employees.Add(employeeEntity);
            await dbContext.SaveChangesAsync(cancellationToken);

            return employeeEntity;
        }
    }
}
