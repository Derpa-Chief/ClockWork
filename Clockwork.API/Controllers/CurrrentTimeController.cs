using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Clockwork.API.Helpers;
using Microsoft.AspNetCore.Mvc;
using Clockwork.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Clockwork.API.Controllers
{
    [Route("api/[controller]")]
    public class CurrentTimeController : Controller
    {
        // GET api/currenttime
        [HttpGet]
        public async Task<IActionResult> Get(string timeZone, int pageIndex = 1, int pageSize = 10)
        {
            var utcTime = DateTime.UtcNow;
            var serverTime = DateTime.Now;
            var ip = this.HttpContext.Connection.RemoteIpAddress.ToString();

            var newCurrentTime = new CurrentTimeQuery
            {
                UTCTime = utcTime,
                ClientIp = ip,
                Time = serverTime,
                TimeZone = timeZone
            };

            PaginatedList<CurrentTimeQuery> pastTimes;

            await using (var db = new ClockworkContext())
            {
                await db.CurrentTimeQueries.AddAsync(newCurrentTime);
                var count = await db.SaveChangesAsync();
                Console.WriteLine("{0} records saved to database", count);

                pastTimes = await PaginatedList<CurrentTimeQuery>.CreateAsync(db.CurrentTimeQueries.AsNoTracking(), pageIndex, pageSize);
                
                Console.WriteLine();
                foreach (var currentTimeQuery in db.CurrentTimeQueries)
                {
                    Console.WriteLine(" - {0}", currentTimeQuery.UTCTime);
                }
            }

            var returnPastTimes = pastTimes.Select(pt => new
            {
                Id = pt.CurrentTimeQueryId,
                Time = TimeHelpers.ConvertTimeToTimeZone(pt.Time, pt.TimeZone).ToString("g"),
                TimeZone = pt.TimeZone
            });

            return Ok(new { currentTime = TimeHelpers.ConvertTimeToTimeZone(newCurrentTime.Time, timeZone).ToString("g"), pastTimes = returnPastTimes, totalPages = pastTimes.TotalPages});
        }
    }
}
