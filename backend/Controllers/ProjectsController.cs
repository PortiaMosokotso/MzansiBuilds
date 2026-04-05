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
                    IsCompleted = p.IsCompleted,
                    CreatedAt = p.CreatedAt,
                    DeveloperName = p.User.FullName
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
                    IsCompleted = p.IsCompleted,
                    CreatedAt = p.CreatedAt,
                    DeveloperName = p.User.FullName
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
            project.IsCompleted = dto.IsCompleted;
            project.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(project);
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
