using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("insights")]
        public async Task<IActionResult> GetInsights()
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            // ===== PROJECT COUNTS =====
            var totalProjects = await _context.Projects
                .CountAsync(p => p.UserId == userId);

            var activeProjects = await _context.Projects
                .CountAsync(p =>
                    p.UserId == userId &&
                    p.Stage != ProjectStage.Completed);

            var completedProjects = await _context.Projects
                .CountAsync(p =>
                    p.UserId == userId &&
                    p.Stage == ProjectStage.Completed);

            // ===== COLLAB REQUESTS =====
            var pendingRequests = await _context.CollaborationRequests
                .CountAsync(r =>
                    r.Project.UserId == userId &&
                    r.Status == RequestStatus.Pending);

            var acceptedRequests = await _context.CollaborationRequests
                .CountAsync(r =>
                    r.Project.UserId == userId &&
                    r.Status == RequestStatus.Accepted);

            var declinedRequests = await _context.CollaborationRequests
                .CountAsync(r =>
                    r.Project.UserId == userId &&
                    r.Status == RequestStatus.Declined);

            // ===== STAGE STATS =====
            var planningCount = await _context.Projects
                .CountAsync(p =>
                    p.UserId == userId &&
                    p.Stage == ProjectStage.Planning);

            var inProgressCount = await _context.Projects
                .CountAsync(p =>
                    p.UserId == userId &&
                    p.Stage == ProjectStage.InProgress);

            var testingCount = await _context.Projects
                .CountAsync(p =>
                    p.UserId == userId &&
                    p.Stage == ProjectStage.Testing);

            var completedStageCount = await _context.Projects
                .CountAsync(p =>
                    p.UserId == userId &&
                    p.Stage == ProjectStage.Completed);

            // ===== TOTAL MILESTONES =====
            var milestoneCount = await _context.Milestones
                .CountAsync(m => m.Project.UserId == userId);

            // ===== RECENT PROJECTS =====
            var recentProjects = await _context.Projects
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.UpdatedAt)
                .Take(3)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    Stage = (int)p.Stage,
                    p.UpdatedAt
                })
                .ToListAsync();

            // ===== RESPONSE =====
            return Ok(new
            {
                totalProjects,
                activeProjects,
                completedProjects,
                pendingRequests,
                acceptedRequests,
                declinedRequests,
                milestoneCount,

                stageStats = new
                {
                    planning = planningCount,
                    inProgress = inProgressCount,
                    testing = testingCount,
                    completed = completedStageCount
                },

                recentProjects
            });
        }
    }
}
