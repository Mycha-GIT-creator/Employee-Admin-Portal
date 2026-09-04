using Employee_Admin_Portal.Data;
using MediatR;

namespace Employee_Admin_Portal.Features.Employees.Commands.DeleteEmployee
{
    public class DeleteEmployeeCommandHandler : IRequestHandler<DeleteEmployeeCommand, bool>
    {
        private readonly ApplicationDbContext dbContext;

        public DeleteEmployeeCommandHandler(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<bool> Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
        {
            var employee = await dbContext.Employees.FindAsync(new object[] { request.Id }, cancellationToken);

            if (employee is null)
            {
                return false;
            }

            dbContext.Employees.Remove(employee);
            await dbContext.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
