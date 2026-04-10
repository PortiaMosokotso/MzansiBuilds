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
                    c.UserId,
                    UserName = c.User.FullName
                })
                .ToListAsync();

            return Ok(comments);
        }

        [HttpPost]
        public async Task<IActionResult> AddComment(int projectId, [FromBody] AddCommentDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var comment = new Comment
            {
                ProjectId = projectId,
                UserId = userId,
                Content = dto.Content 
            };
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Comment added successfully." });
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(int projectId, int commentId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var comment = await _context.Comments
                .FirstOrDefaultAsync(c => c.Id == commentId && c.ProjectId == projectId);

            if (comment == null)
                return NotFound(new { message = "Comment not found." });

            if (comment.UserId != userId)
                return Forbid();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Comment deleted successfully." });
        }
    }
}
