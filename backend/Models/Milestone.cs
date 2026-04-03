using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Milestone
{
    public int Id { get; set; }

    [Required]
    [MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

        public DateTime AchievedAt { get; set; } = DateTime.UtcNow;

     // Foreign keys
    public int ProjectId { get; set; }

    [ForeignKey("ProjectId")]
    public Project Project { get; set; } = null!;


    }
}
