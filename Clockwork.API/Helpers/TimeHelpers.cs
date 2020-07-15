using System;

namespace Clockwork.API.Helpers
{
    public class TimeHelpers
    {
        public static DateTime ConvertTimeToTimeZone(DateTime dateTime, string timeZoneId)
        {
            var timeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            DateTime convertedTime = TimeZoneInfo.ConvertTimeFromUtc(dateTime.ToUniversalTime(), timeZone);
            return convertedTime;
        }
    }
}