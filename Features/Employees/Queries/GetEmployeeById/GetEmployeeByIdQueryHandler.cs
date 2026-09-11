using Employee_Admin_Portal.Data;
using Employee_Admin_Portal.Models.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Employee_Admin_Portal.Features.Employees.Queries.GetEmployeeById
{
    public class GetEmployeeByIdQueryHandler : IRequestHandler<GetEmployeeByIdQuery, Employee?>
    {
        private readonly ApplicationDbContext dbContext;

        public GetEmployeeByIdQueryHandler(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Employee?> Handle(GetEmployeeByIdQuery request, CancellationToken cancellationToken)
        {
            return await dbContext.Employees
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);
        }
    }
}
