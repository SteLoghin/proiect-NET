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
    public class CreatePropertyHandlerTests
    {
        private readonly Mock<IPropertyService> _mockService;
        private readonly CreatePropertyHandler _handler;
        public CreatePropertyHandlerTests()
        {
            _mockService = new Mock<IPropertyService>();
            _handler = new CreatePropertyHandler(_mockService.Object);
        }

        [Fact]
        public void Handler_Returns_New_Property()
        {
            var property = _handler.Handle(new CreateProperty
            {
                Zone = "Copou",
                Area = 90,
                Rooms = 3,
                Bathrooms = 1,
                Kitchens = 2,
                Floor = 3,
                Link = "1",
                Price = 280
            }, new CancellationToken());

            Assert.IsType<Task<Property>>(property);
        }
    }
}
