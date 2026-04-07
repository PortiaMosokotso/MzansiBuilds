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
    public class CollaborationRequestsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CollaborationRequestsController(AppDbContext context)
        {
            _context = context;
        }

        // SEND REQUEST
        [HttpPost("{projectId}")]
        public async Task<IActionResult> RaiseHand(int projectId, [FromBody] string? message)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
                return NotFound("Project not found.");

            if (project.UserId == userId)
                return BadRequest("You cannot collaborate on your own project.");

            var existing = await _context.CollaborationRequests
                .FirstOrDefaultAsync(x =>
                    x.ProjectId == projectId &&
                    x.UserId == userId &&
                    x.Status == RequestStatus.Pending);

            if (existing != null)
                return BadRequest("Request already sent.");

            var request = new CollaborationRequest
            {
                ProjectId = projectId,
                UserId = userId,
                Message = message,
                Status = RequestStatus.Pending
            };

            _context.CollaborationRequests.Add(request);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Collaboration request sent." });
        }

        // VIEW INCOMING REQUESTS
        [HttpGet("incoming")]
        public async Task<IActionResult> GetIncomingRequests()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var requests = await _context.CollaborationRequests
                .Include(r => r.User)
                .Include(r => r.Project)
                .Where(r => r.Project.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    r.Id,
                    r.Message,
                    r.Status,
                    r.CreatedAt,
                    DeveloperName = r.User.FullName,
                    ProjectTitle = r.Project.Title
                })
                .ToListAsync();

            return Ok(requests);
        }

        // ACCEPT REQUEST
        [HttpPatch("{id}/accept")]
        public async Task<IActionResult> AcceptRequest(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var request = await _context.CollaborationRequests
                .Include(r => r.Project)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (request == null)
                return NotFound("Request not found.");

            if (request.Project.UserId != userId)
                return Forbid();

            request.Status = RequestStatus.Accepted;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Collaboration request accepted." });
        }

        // DECLINE REQUEST
        [HttpPatch("{id}/decline")]
        public async Task<IActionResult> DeclineRequest(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var request = await _context.CollaborationRequests
                .Include(r => r.Project)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (request == null)
                return NotFound("Request not found.");

            if (request.Project.UserId != userId)
                return Forbid();

            request.Status = RequestStatus.Declined;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Collaboration request declined." });
        }
    }
}