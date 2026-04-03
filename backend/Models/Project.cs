using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{

    public enum ProjectStage
    {
        Planning,
        InProgress,
        Testing,
        Completed
    }

    public class Project
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public ProjectStage Stage { get; set; } = ProjectStage.Planning;

        public bool SupportRequired { get; set; } = false;

        [MaxLength(500)]
        public string? SupportDetails { get; set; }

        public bool IsCompleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        public ICollection<Milestone> Milestones { get; set; } = new List<Milestone>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<CollaborationRequest> CollaborationRequests { get; set; } = new List<CollaborationRequest>();
    }
}
