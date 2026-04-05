using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/projects/{projectId}/milestones")]
    [Authorize]
    public class MilestonesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MilestonesController(AppDbContext context)
        {
            _context = context;
        }

        // GET all milestones for a project
        [HttpGet]
        public async Task<IActionResult> GetMilestones(int projectId)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null)
                return NotFound(new { message = "Project not found." });

            var milestones = await _context.Milestones
                .Where(m => m.ProjectId == projectId)
                .OrderBy(m => m.AchievedAt)
                .Select(m => new {
                    m.Id,
                    m.Title,
                    m.Description,
                    m.AchievedAt,
                    m.ProjectId
                })
                .ToListAsync();

            return Ok(milestones);
        }

        // POST add a milestone to a project
        [HttpPost]
        public async Task<IActionResult> AddMilestone(
            int projectId,
            [FromBody] CreateMilestoneDTO dto)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null)
                return NotFound(new { message = "Project not found." });

            // Only project owner can add milestones
            if (project.UserId != userId)
                return Forbid();

            var milestone = new Milestone
            {
                Title = dto.Title,
                Description = dto.Description,
                AchievedAt = DateTime.UtcNow,
                ProjectId = projectId
            };

            _context.Milestones.Add(milestone);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                milestone.Id,
                milestone.Title,
                milestone.Description,
                milestone.AchievedAt,
                milestone.ProjectId
            });
        }

        // DELETE a milestone
        [HttpDelete("{milestoneId}")]
        public async Task<IActionResult> DeleteMilestone(
            int projectId,
            int milestoneId)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var milestone = await _context.Milestones
                .Include(m => m.Project)
                .FirstOrDefaultAsync(m =>
                    m.Id == milestoneId &&
                    m.ProjectId == projectId);

            if (milestone == null)
                return NotFound(new { message = "Milestone not found." });

            if (milestone.Project.UserId != userId)
                return Forbid();

            _context.Milestones.Remove(milestone);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Milestone deleted." });
        }
    }
}
