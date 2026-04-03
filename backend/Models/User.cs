using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Project> Projects { get; set; } = new List<Project>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<CollaborationRequest> CollaborationRequests { get; set; } = new List<CollaborationRequest>();

    }
}
