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
            var query = dbContext.Employees.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.NameFilter))
                query = query.Where(e => e.Name.Contains(request.NameFilter));

            if (request.MinSalary.HasValue)
                query = query.Where(e => e.Salary >= request.MinSalary);

            if (request.MaxSalary.HasValue)
                query = query.Where(e => e.Salary <= request.MaxSalary);

            return await query.ToListAsync(cancellationToken);
        }
    }
}