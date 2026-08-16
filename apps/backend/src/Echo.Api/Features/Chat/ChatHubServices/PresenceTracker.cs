using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Features.Chat.ChatHubServices
{
    public class PresenceTracker
    {
        private readonly ConcurrentDictionary<string, HashSet<string>> _onlineUsers = new();


        public Task<bool> UserConnected(string userId, string connectionId)
        {
            bool isFirstConnection = false;
            _onlineUsers.AddOrUpdate(
                userId,
                _ =>
                {
                    isFirstConnection = true;
                    return new HashSet<string> { connectionId };
                },
                (_, connections) =>
                {
                    lock (connections)
                    {
                        connections.Add(connectionId);
                    }
                    return connections;
                });
            return Task.FromResult(isFirstConnection);
        }

        public Task<bool> UserDisconnected(string userId, string connectionId)
        {
            bool isCompletelyOffline = false;
            if (_onlineUsers.TryGetValue(userId, out var connections))
            {
                lock (connections)
                {
                    connections.Remove(connectionId);
                    if (connections.Count == 0)
                    {
                        _onlineUsers.TryRemove(userId, out _);
                        isCompletelyOffline = true;
                    }
                }
            }
            return Task.FromResult(isCompletelyOffline);
        }


        public Task<List<string>> GetOnlineUsersAsync(List<string> userIds)
        {
            var onlineUsers = userIds.Where(id => _onlineUsers.ContainsKey(id)).ToList();
            return Task.FromResult(onlineUsers);
        }
        public bool IsUserOnline(string userId)
        {
            var isExist = _onlineUsers.ContainsKey(userId);

            if (isExist)
            {
                return true;
            }
            return false;
        }
        public Task<IReadOnlyList<string>> GetConnectionIdsForUser(string userId)
        {
            if (_onlineUsers.TryGetValue(userId, out var connections))
            {
                lock (connections)
                {
                    return Task.FromResult<IReadOnlyList<string>>(connections.ToList());
                }
            }
            return Task.FromResult<IReadOnlyList<string>>(Array.Empty<string>());
        }
    }
}