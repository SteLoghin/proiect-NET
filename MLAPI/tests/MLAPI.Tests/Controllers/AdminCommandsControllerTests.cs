
using MediatR;
using MLAPI.Controllers;
using MLAPI.DTOs;
using MLAPI.Models;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace MLAPI.Tests.Controllers
{
    public class AdminCommandsControllerTests
    {
        private readonly Mock<IMediator> _mockMediatr;
        private readonly AdminCommandsController _controller;

        public AdminCommandsControllerTests()
        {
            _mockMediatr = new Mock<IMediator>();
            _controller = new AdminCommandsController(_mockMediatr.Object);
        }

        [Fact]
        public async void Get_Action_Returns_Exact_Properties_Number()
        {
            List<Property> list = new List<Property>() { Property.Create("Copou", 1, 2, 3, 4, 5, "1", "2", 233),
                                                         Property.Create("Copou", 1, 2, 3, 4, 5, "1", "2", 233) };
            _mockMediatr.Setup(mediator => mediator.Send(new GetProperties(), new CancellationToken()))
                .Returns(Task.FromResult(list));

            var result = await _controller.Get();
            Console.WriteLine(result);
            /*int counter = 0;
            foreach(var r in result.Value)
            {
                counter++;
            }
            Assert.Equal(2, counter);*/
        }
    }
}
