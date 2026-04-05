using backend.Models;

namespace backend.DTOs
{
    public class UpdateProjectDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ProjectStage Stage { get; set; }
        public bool SupportRequired { get; set; }
        public string? SupportDetails { get; set; }
    }
}
