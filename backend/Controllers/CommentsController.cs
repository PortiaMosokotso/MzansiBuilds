using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/projects/{projectId}/comments")]
    [Authorize]
    public class CommentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetComments(int projectId)
        {
            var comments = await _context.Comments
                .Include(c => c.User)
                .Where(c => c.ProjectId == projectId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    UserName = c.User.FullName
                })
                .ToListAsync();

            return Ok(comments);
        }

        [HttpPost]
        public async Task<IActionResult> AddComment(int projectId, [FromBody] string content)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var comment = new Comment
            {
                ProjectId = projectId,
                UserId = userId,
                Content = content
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Comment added successfully." });
        }
    }
}
