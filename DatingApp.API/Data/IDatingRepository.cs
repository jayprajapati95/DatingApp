using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
        // This is called generic syntax and T represent class, for example T = User, Photo class
        void Add<T>(T entity) where T: class; 
        void Delete<T>(T entity) where T: class; 
        Task<bool> SaveAll(); // Threading pocess "Task", Bool return 0 changes or more changes
        Task<PagedList<User>> GetUsers(UserParams userParams);
        Task<User> GetUser(int id); // For Edit, Induvisual user get
        //Task<Photo> GetPhoto(int id);

        //Task<Photo> GetMainPhotoForUser(int userId);
        
    }
}