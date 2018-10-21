using System.Collections.Generic;
using DatingApp.API.Models;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        private readonly DataContext _Context;
        public Seed(DataContext Context)
        {
            _Context = Context;
            
        }

        public void SeedUsers()
        {
            var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
            var users = JsonConvert.DeserializeObject<List<User>>(userData);
            foreach (var user in users)
            {
                byte[] PasswordHash, PasswordSalt;
                CreatePasswordHash("Password", out PasswordHash, out PasswordSalt);
                user.PasswordHash = PasswordHash;
                user.PasswordSalt = PasswordSalt;
                user.UserName = user.UserName.ToLower();
                _Context.Users.Add(user);
            }
            _Context.SaveChanges();
        }
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));            
            }
            
        }
    }
}