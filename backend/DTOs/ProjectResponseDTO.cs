namespace backend.DTOs
{
    public class ProjectResponseDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Stage { get; set; }
        public bool SupportRequired { get; set; }
        public string? SupportDetails { get; set; }
        public DateTime CreatedAt { get; set; }
        public string DeveloperName { get; set; } = string.Empty;
        public int UserId { get; set; }
    }
}
