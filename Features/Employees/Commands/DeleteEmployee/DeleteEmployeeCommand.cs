using MediatR;

namespace Employee_Admin_Portal.Features.Employees.Commands.DeleteEmployee
{
    public class DeleteEmployeeCommand : IRequest<bool>
    {
        public Guid Id { get; }

        public DeleteEmployeeCommand(Guid id)
        {
            Id = id;
        }
    }
}
