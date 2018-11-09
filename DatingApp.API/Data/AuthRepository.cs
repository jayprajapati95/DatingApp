using System;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _objDataContext;
        public AuthRepository(DataContext _objContext)
        {
            this._objDataContext = _objContext;

        }
        public async Task<User> Login(string UserName, string Password)
        {
            var user = await _objDataContext.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName == UserName);

            if(user == null)
                return null;

            if(!VerifyPaswordHash(Password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;
        }

        private bool VerifyPaswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
               var ComputedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));   
               for(int i = 0; i < ComputedHash.Length; i++)
               {
                   if(ComputedHash[i] != passwordHash[i]) return false;
               }         
            }
            return true;
        }

        public async Task<User> Register(User user, string password)
        {
           byte [] passwordHash, passwordSalt;
           CreatePasswordHash(password, out passwordHash, out passwordSalt);

           user.PasswordHash = passwordHash;
           user.PasswordSalt = passwordSalt;

            await _objDataContext.Users.AddAsync(user);
            await _objDataContext.SaveChangesAsync();

            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));            
            }
            
        }

        public async Task<bool> UserExists(string UserName)
        {
            if(await _objDataContext.Users.AnyAsync(x => x.UserName == UserName))
                return true;

            return false;
        }
    }
}