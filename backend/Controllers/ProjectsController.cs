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
        // CREATE PROJECT
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

        // GET ALL PROJECTS
        [HttpGet]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = await _context.Projects
                .Include(p => p.User)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new ProjectResponseDTO
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    Stage = (int)p.Stage,
                    SupportRequired = p.SupportRequired,
                    SupportDetails = p.SupportDetails,
                    CreatedAt = p.CreatedAt,
                    DeveloperName = p.User.FullName,
                    UserId = p.UserId
                })
                .ToListAsync();

            return Ok(projects);
        }

        // GET SINGLE PROJECT
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectById(int id)
        {
            var project = await _context.Projects
                .Include(p => p.User)
                .Where(p => p.Id == id)
                .Select(p => new ProjectResponseDTO
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    Stage = (int)p.Stage,
                    SupportRequired = p.SupportRequired,
                    SupportDetails = p.SupportDetails,
                    CreatedAt = p.CreatedAt,
                    DeveloperName = p.User.FullName,
                    UserId = p.UserId
                })
                .FirstOrDefaultAsync();

            if (project == null)
                return NotFound("Project not found.");

            return Ok(project);
        }

        // UPDATE PROJECT
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, UpdateProjectDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound("Project not found.");

            if (project.UserId != userId)
                return Forbid("You can only edit your own projects.");

            project.Title = dto.Title;
            project.Description = dto.Description;
            project.Stage = dto.Stage;
            project.SupportRequired = dto.SupportRequired;
            project.SupportDetails = dto.SupportDetails;
            project.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(project);
        }
        // UPDATE PROJECT STAGE
        [HttpPatch("{id}/stage")]
        public async Task<IActionResult> UpdateProjectStage(int id, [FromBody] int stage)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound("Project not found.");

            if (project.UserId != userId)
                return Forbid("You can only edit your own projects.");

            if (!Enum.IsDefined(typeof(ProjectStage), stage))
                return BadRequest("Invalid stage value.");

            project.Stage = (ProjectStage)stage;
            project.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Stage updated.", stage = project.Stage });
        }

        // DELETE PROJECT
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound("Project not found.");

            if (project.UserId != userId)
                return Forbid("You can only delete your own projects.");

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Project deleted successfully." });
        }

        // GET COMPLETED PROJECTS - Celebration Wall
        [HttpGet("completed")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCompletedProjects()
        {
            var completed = await _context.Projects
                .Include(p => p.User)
                .Include(p => p.Milestones)
                .Where(p => p.Stage == ProjectStage.Completed)
                .OrderByDescending(p => p.UpdatedAt)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Description,
                    p.CreatedAt,
                    p.UpdatedAt,
                    DeveloperName = p.User.FullName,
                    MilestoneCount = p.Milestones.Count
                })
                .ToListAsync();

            return Ok(completed);
        }
    }
}
