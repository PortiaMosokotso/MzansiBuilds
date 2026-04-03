using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public enum RequestStatus
    {
        Pending,
        Accepted,
        Declined
    }

    public class CollaborationRequest
    {
        public int Id { get; set; }

        [MaxLength(500)]
        public string? Message { get; set; }

        public RequestStatus Status { get; set; } = RequestStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign keys
        public int UserId { get; set; }
        public int ProjectId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [ForeignKey("ProjectId")]
        public Project Project { get; set; } = null!;
    }
}
