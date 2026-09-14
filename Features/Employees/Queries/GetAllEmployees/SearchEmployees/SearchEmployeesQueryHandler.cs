using Employee_Admin_Portal.Data;
using Employee_Admin_Portal.Models.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Employee_Admin_Portal.Features.Employees.Queries.SearchEmployees
{
    public class SearchEmployeesQueryHandler : IRequestHandler<SearchEmployeesQuery, List<Employee>>
    {
        private readonly ApplicationDbContext dbContext;

        public SearchEmployeesQueryHandler(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<Employee>> Handle(SearchEmployeesQuery request, CancellationToken cancellationToken)
        {
            return await dbContext.Employees
                .FromSqlInterpolated($@"
                    EXEC sp_GetEmployeesBySalaryRange
                        @NameFilter = {request.NameFilter},
                        @MinSalary = {request.MinSalary},
                        @MaxSalary = {request.MaxSalary}")
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
    }
}