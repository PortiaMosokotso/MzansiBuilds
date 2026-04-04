using backend.Data;
using backend.Models;
using backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
//    [ApiController]
//    [Route("api/[controller]")]
//    [Authorize]
//    public class MilestonesController : ControllerBase
//    {
//        private readonly AppDbContext _context;

//        public MilestonesController(AppDbContext context)
//        {
//            _context = context;
//        }

//        [HttpPost]
//        public async Task<IActionResult> AddMilestone(CreateMilestoneDTO dto)
//        {
//            var milestone = new Milestone
//            {
//                Title = dto.Title,
//                Description = dto.Description,
//                ProjectId = dto.ProjectId
//            };

//            _context.Milestones.Add(milestone);

//            var project = await _context.Projects.FindAsync(dto.ProjectId);
//            if (project != null)
//                project.UpdatedAt = DateTime.UtcNow;

//            await _context.SaveChangesAsync();

//            return Ok(milestone);
//        }
//    }
}
