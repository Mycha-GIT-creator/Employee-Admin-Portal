using Employee_Admin_Portal.Models.Entities;
using MediatR;

namespace Employee_Admin_Portal.Features.Employees.Queries.SearchEmployees
{
    public class SearchEmployeesQuery : IRequest<List<Employee>>
    {
        public string? NameFilter { get; set; }
        public decimal? MinSalary { get; set; }
        public decimal? MaxSalary { get; set; }
    }
}