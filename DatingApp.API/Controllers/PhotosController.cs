using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;


namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;
        public PhotosController(IDatingRepository repo, IMapper mapper,
            IOptions<CloudinarySettings> cloudinaryConfig)
        {
            this._cloudinaryConfig = cloudinaryConfig;
            this._mapper = mapper;
            this._repo = repo;

            Account _account = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(_account);

        }
        
        // public async Task<IActionResult> GetPhoto(int id)
        //{
           // var photoFormRepo = await _repo.GetPhoto(id);
          //  var photo = _mapper.Map<PhotoForReturnDto>(photoFormRepo);
          //  return Ok();
       // }
        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailDto>(user);
            var photo = _mapper.Map<PhotoForReturnDto>(userToReturn);
            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, 
            [FromForm]PhotoForCreationDto photoForCreationDto)
        {
            // first it check the current user is valid through token 
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

             var userFromRepo = await _repo.GetUser(userId);

             var file = photoForCreationDto.File;

             var uploadResult = new ImageUploadResult();

             if(file.Length > 0)
             {
                 using(var stream = file.OpenReadStream()) 
                 {
                     var uploadParams = new ImageUploadParams
                     {
                        File = new FileDescription(file.Name , stream),
                        Transformation = new Transformation()
                            .Width(500).Height(500).Crop("fill").Gravity("face")
                     };
                      uploadResult = _cloudinary.Upload(uploadParams);
                 }
                
             }
            photoForCreationDto.Url = uploadResult.Uri.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;
            var photo = _mapper.Map<Photo>(photoForCreationDto);

            if(!userFromRepo.Photos.Any(u => u.IsMain))
                photo.IsMain = true;

            userFromRepo.Photos.Add(photo);

            

            if(await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id}, photoToReturn);
            }

            return BadRequest("Could not add the photo");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            // first it check the current user is valid through token 
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

                var userFromRepo = await _repo.GetUser(userId);

                if(!userFromRepo.Photos.Any(p => p.Id == id))   
                    return Unauthorized();

                var photoList = userFromRepo.Photos.Where(p =>p.Id == id).ToList();
                if(photoList[0].IsMain)
                    return BadRequest("This is already main photo.");
                //var photoFromRepo = await _repo.GetUser(id);
               // if (photoFromRepo.IsMain)
                    //return BadRequest("This is already main photo.");
                
                //var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);
                //currentMainPhoto.IsMain =false;

                var CurrentphotoList = userFromRepo.Photos.Where(p =>p.Id == id).ToList();
                CurrentphotoList[0].IsMain =false;
                //photoFromRepo.IsMain = true;
                photoList[0].IsMain = true;
               // photo.IsMain = true;
                   
                if(await _repo.SaveAll())
                    return NoContent();

                return BadRequest("could not set to main photo!");
                
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            // first it check the current user is valid through token 
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repo.GetUser(userId);

            if(!userFromRepo.Photos.Any(p => p.Id == id))   
                return Unauthorized();

            var photoList = userFromRepo.Photos.Where(p =>p.Id == id).ToList();

            if(photoList[0].PublicId != null)
            {
                var deleteParms = new DeletionParams(photoList[0].PublicId);

                var result = _cloudinary.Destroy(deleteParms);

                if(result.Result == "ok") 
                {
                    _repo.Delete(photoList[0]);
                }
            }
            if(photoList[0].PublicId == null)
            {
                _repo.Delete(photoList[0]);
            }


            if(await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Faild to delete!");
        }
    }
}