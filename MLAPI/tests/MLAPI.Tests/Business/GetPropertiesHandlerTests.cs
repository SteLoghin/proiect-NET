using MLAPI.Business;
using MLAPI.DTOs;
using MLAPI.Models;
using MLAPI.Services;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace MLAPI.Tests.Controller
{
    public class GetPropertiesHandlerTests
    {
        private readonly Mock<IPropertyService> _mockService;
        private readonly GetPropertiesHandler _handler;

        public GetPropertiesHandlerTests()
        {
            _mockService = new Mock<IPropertyService>();
            _handler = new GetPropertiesHandler(_mockService.Object);
        }

        [Fact]
        public void Handle_Returns_Async_List()
        {
            var results = _handler.Handle(new GetProperties(), new CancellationToken());
            Assert.IsType<Task<List<Property>>>(results);
        }
    }
}
