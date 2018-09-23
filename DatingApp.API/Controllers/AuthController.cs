using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        public AuthController(IAuthRepository repo)
        {
            _repo = repo;

        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto _UserForRegisterDto)
        {
           _UserForRegisterDto.UserName = _UserForRegisterDto.UserName.ToLower();

            if(await _repo.UserExists(_UserForRegisterDto.UserName))
                return BadRequest("User name alredy exists!");

            var UserToCreate = new User
            {
                UserName = _UserForRegisterDto.UserName
            };

            var CreatedUser = await _repo.Register(UserToCreate,_UserForRegisterDto.Password);
            
            return StatusCode(201);
        
        }
    }
}