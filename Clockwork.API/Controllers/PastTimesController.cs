using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Clockwork.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Clockwork.API.Controllers
{
    [Route("api/[controller]")]
    public class PastTimesController : Controller
    {
        // GET api/pasttimes
        [HttpGet]
        public async Task<IActionResult> Get(int pageIndex = 1, int pageSize = 10)
        {
            PaginatedList<CurrentTimeQuery> pastTimes;
            
            await using (var db = new ClockworkContext())
            {
                pastTimes = await PaginatedList<CurrentTimeQuery>.CreateAsync(db.CurrentTimeQueries.AsNoTracking(), pageIndex, pageSize);
            }

            var returnPastTimes = pastTimes.Select(pt => new
            {
                Id = pt.CurrentTimeQueryId,
                Time = pt.Time.ToString("g")
            });
            
            return Ok(new { pastTimes = returnPastTimes, pageIndex = pageIndex, totalPages = pastTimes.TotalPages });
        }
    }
}