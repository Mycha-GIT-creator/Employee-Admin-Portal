using Employee_Admin_Portal.Data;
using Employee_Admin_Portal.Models.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Employee_Admin_Portal.Features.Employees.Queries.GetAllEmployees
{
    public class GetAllEmployeesQueryHandler : IRequestHandler<GetAllEmployeesQuery, List<Employee>>
    {
        private readonly ApplicationDbContext dbContext;

        public GetAllEmployeesQueryHandler(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<Employee>> Handle(GetAllEmployeesQuery request, CancellationToken cancellationToken)
        { 
            return await dbContext.Employees.AsNoTracking().ToListAsync(cancellationToken);
        }
    }
}
