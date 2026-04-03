using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Project> Projects => Set<Project>();
        public DbSet<Milestone> Milestones => Set<Milestone>();
        public DbSet<Comment> Comments => Set<Comment>();
        public DbSet<CollaborationRequest> CollaborationRequests => Set<CollaborationRequest>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unique Email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Projects -> User
            modelBuilder.Entity<Project>()
                .HasOne(p => p.User)
                .WithMany(u => u.Projects)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict); // User deletion does NOT cascade to projects

            // Milestones -> Project
            modelBuilder.Entity<Milestone>()
                .HasOne(m => m.Project)
                .WithMany(p => p.Milestones)
                .HasForeignKey(m => m.ProjectId)
                .OnDelete(DeleteBehavior.Cascade); // Delete project → delete milestones

            // Comments -> Project
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Project)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.ProjectId)
                .OnDelete(DeleteBehavior.Cascade); // Delete project → delete comments

            // Comments -> User
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Delete user → restrict

            // CollaborationRequests -> Project
            modelBuilder.Entity<CollaborationRequest>()
                .HasOne(cr => cr.Project)
                .WithMany(p => p.CollaborationRequests)
                .HasForeignKey(cr => cr.ProjectId)
                .OnDelete(DeleteBehavior.Cascade); // Delete project → delete collaboration requests

            // CollaborationRequests -> User
            modelBuilder.Entity<CollaborationRequest>()
                .HasOne(cr => cr.User)
                .WithMany(u => u.CollaborationRequests)
                .HasForeignKey(cr => cr.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent multiple cascade paths
        }
    }
}