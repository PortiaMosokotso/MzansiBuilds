using backend.Data;
using backend.Models;
using backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(CreateProjectDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var project = new Project
            {
                Title = dto.Title,
                Description = dto.Description,
                Stage = dto.Stage,
                SupportRequired = dto.SupportRequired,
                SupportDetails = dto.SupportDetails,
                UserId = userId
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return Ok(project);
        }

        [HttpGet("feed")]
        public async Task<IActionResult> GetLiveFeed()
        {
            var projects = await _context.Projects
                .Include(x => x.User)
                .Include(x => x.Comments)
                .Include(x => x.Milestones)
                .OrderByDescending(x => x.UpdatedAt)
                .ToListAsync();

            return Ok(projects);
        }

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
                return NotFound();

            project.IsCompleted = true;
            project.Stage = ProjectStage.Completed;
            project.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(project);
        }

        [HttpGet("celebration-wall")]
        public async Task<IActionResult> CelebrationWall()
        {
            var completedProjects = await _context.Projects
                .Include(x => x.User)
                .Where(x => x.IsCompleted)
                .OrderByDescending(x => x.UpdatedAt)
                .ToListAsync();

            return Ok(completedProjects);
        }
    }
}
