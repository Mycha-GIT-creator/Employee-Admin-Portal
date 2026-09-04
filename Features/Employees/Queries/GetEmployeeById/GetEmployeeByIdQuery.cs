using Employee_Admin_Portal.Models.Entities;
using MediatR;

namespace Employee_Admin_Portal.Features.Employees.Queries.GetEmployeeById
{
    public class GetEmployeeByIdQuery : IRequest<Employee?>
    {
        public Guid Id { get; }

        public GetEmployeeByIdQuery(Guid id)
        {
            Id = id;
        }
    }
}
