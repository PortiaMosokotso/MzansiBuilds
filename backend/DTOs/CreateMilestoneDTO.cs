using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateMilestoneDTO
    {
        [Required]
        [MaxLength(120)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
    }
}
