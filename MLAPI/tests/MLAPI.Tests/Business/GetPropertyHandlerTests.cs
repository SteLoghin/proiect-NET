using MLAPI.Business;
using MLAPI.DTOs;
using MLAPI.Models;
using MLAPI.Services;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace MLAPI.Tests.Business
{
    public class GetPropertyHandlerTests
    {
        private readonly Mock<IPropertyService> _mockService;
        private readonly GetPropertyHandler _handler;

        public GetPropertyHandlerTests()
        {
            _mockService = new Mock<IPropertyService>();
            _handler = new GetPropertyHandler(_mockService.Object);
        }

        [Fact]
        public void Handle_Returns_Async_Property()
        {
            var result = _handler.Handle(new GetProperty(), new CancellationToken());
            Assert.IsType<Task<Property>>(result);
        }
    }
}
