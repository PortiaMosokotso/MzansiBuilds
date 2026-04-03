using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Comment
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(500)]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign keys
        public int ProjectId { get; set; }
        public int UserId { get; set; }

        [ForeignKey("ProjectId")]
        public Project Project { get; set; } = null!;

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }
}
