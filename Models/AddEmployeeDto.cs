namespace Employee_Admin_Portal.Models
{
    public class AddEmployeeDto
    {
        public required string Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public decimal Salary { get; set; }
    }
}
