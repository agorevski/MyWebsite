using SQLite;
using Driftly.Models;

namespace Driftly.Data;

/// <summary>
/// Service for managing SQLite database operations
/// </summary>
public class DatabaseService
{
    private readonly SQLiteAsyncConnection _database;

    public DatabaseService(string dbPath)
    {
        _database = new SQLiteAsyncConnection(dbPath);
        _database.CreateTableAsync<Mix>().Wait();
    }

    public Task<List<Mix>> GetMixesAsync()
    {
        return _database.Table<Mix>().ToListAsync();
    }

    public Task<Mix?> GetMixAsync(int id)
    {
        return _database.Table<Mix>().Where(m => m.Id == id).FirstOrDefaultAsync()!;
    }

    public Task<int> SaveMixAsync(Mix mix)
    {
        if (mix.Id != 0)
        {
            return _database.UpdateAsync(mix);
        }
        else
        {
            return _database.InsertAsync(mix);
        }
    }

    public Task<int> DeleteMixAsync(Mix mix)
    {
        return _database.DeleteAsync(mix);
    }
}
