using Echo.Api.Features.Auth;
using Echo.Api.Features.Chat;
using Echo.Api.Features.Shared;
using Echo.Api.Features.Shared.Infrastructure.Persistence;
using Echo.Api.Features.Users;
using Echo.Api.Shared;
using Echo.Api.Shared.Common;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();


builder.Services.AddSharedFeature(builder.Configuration);

builder.Services.AddAuthServices();
builder.Services.AddChatServices();
builder.Services.AddUserServices();
builder.Services.AddControllers(options =>
{
    options.Conventions.Add(new ApiRouteConvention());
});
builder.Services.AddSignalR();

builder.Services.AddHttpContextAccessor();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .SetIsOriginAllowed(_ => true)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();

}



app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseWebSockets();

app.MapControllers();

app.MapHub<ChatHub>("/chat");

app.Run();