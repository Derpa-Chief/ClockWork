using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Clockwork.API.Models;

namespace Clockwork.API.Controllers
{
    [Route("api/[controller]")]
    public class CurrentTimeController : Controller
    {
        // GET api/currenttime
        [HttpGet]
        public IActionResult Get()
        {
            var utcTime = DateTime.UtcNow;
            var serverTime = DateTime.Now;
            var ip = this.HttpContext.Connection.RemoteIpAddress.ToString();

            var newCurrentTime = new CurrentTimeQuery
            {
                UTCTime = utcTime,
                ClientIp = ip,
                Time = serverTime
            };
            
            var pastTimes = new List<CurrentTimeQuery>();

            using (var db = new ClockworkContext())
            {
                db.CurrentTimeQueries.Add(newCurrentTime);
                var count = db.SaveChanges();
                Console.WriteLine("{0} records saved to database", count);

                pastTimes = db.CurrentTimeQueries.ToList();
                
                Console.WriteLine();
                foreach (var currentTimeQuery in db.CurrentTimeQueries)
                {
                    Console.WriteLine(" - {0}", currentTimeQuery.UTCTime);
                }
            }

            var returnPastTimes = pastTimes.Select(pt => new
            {
                Id = pt.CurrentTimeQueryId,
                Time = pt.Time.ToString("g")
            });

            return Ok(new { currentTime = newCurrentTime.Time.ToString("g"), pastTimes = returnPastTimes });
        }
    }
}
