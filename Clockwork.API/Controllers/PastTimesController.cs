using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Clockwork.API.Models;

namespace Clockwork.API.Controllers
{
    [Route("api/[controller]")]
    public class PastTimesController : Controller
    {
        // GET api/pasttimes
        [HttpGet]
        public IActionResult Index()
        {
            List<CurrentTimeQuery> pastTimes;
            
            using (var db = new ClockworkContext())
            {
                pastTimes = db.CurrentTimeQueries.ToList();
            }
            
            return Ok(pastTimes);
        }
    }
}