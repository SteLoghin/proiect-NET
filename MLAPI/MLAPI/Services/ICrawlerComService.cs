using MLAPI.DTOs;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace MLAPI.Services
{
    public interface ICrawlerComService
    {
        Task<IEnumerable<CreateProperty>> GetCrawlerProperties();
        Task<HttpResponseMessage> StartCrawler();
    }
}