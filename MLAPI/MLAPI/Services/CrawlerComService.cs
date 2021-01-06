using Microsoft.AspNetCore.Mvc;
using MLAPI.DTOs;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace MLAPI.Services
{
    public class CrawlerComService : ICrawlerComService
    {
        private readonly HttpClient client;
        public CrawlerComService()
        {
            this.client = new HttpClient();
            client.BaseAddress = new Uri("https://properties-crawler.herokuapp.com/");
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.Timeout = TimeSpan.FromMinutes(10);
        }

        public async Task<IEnumerable<CreateProperty>> GetCrawlerProperties()
        {
            HttpResponseMessage response = await client.GetAsync("api/properties");
            if (response.IsSuccessStatusCode)
            {
                var properties = await response.Content.ReadAsAsync<IEnumerable<CreateProperty>>();
                return properties;
            }
            return null;
        }

        public async Task<HttpResponseMessage> StartCrawler()
        {
            HttpResponseMessage response = await client.PostAsJsonAsync<JsonResult>("api/crawler/", null);
            if (response.IsSuccessStatusCode)
            {
                return response;
            }
            else return null;
        }

        public async Task<HttpResponseMessage> GetCrawlerStatistics()
        {
            HttpResponseMessage response = await client.GetAsync("api/crawler/");
            if (response.IsSuccessStatusCode)
            {
                return response;
            }
            return null;
        }
    }
}
