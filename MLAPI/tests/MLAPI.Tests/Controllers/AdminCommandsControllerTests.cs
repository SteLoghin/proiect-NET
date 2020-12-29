
using MediatR;
using Microsoft.AspNetCore.Mvc;
using MLAPI.Business;
using MLAPI.Controllers;
using MLAPI.DTOs;
using MLAPI.Models;
using MLAPI.Services;
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
        private readonly AdminController _controller;


        public AdminCommandsControllerTests()
        {
            _mockMediatr = new Mock<IMediator>();
            _controller = new AdminCommandsController(_mockMediatr.Object);
        }

        [Fact]
        public void Get_Action_Returns_Ok_Result()
        {
            _mockMediatr.Setup(x => x.Send(It.IsAny<GetProperties>(), new CancellationToken())).ReturnsAsync(new List<Property>());

            //Action
            var result = _controller.Get();

            //Assert
            Assert.IsType<Task<ActionResult<IEnumerable<Property>>>>(result);
        }

        [Fact]
        public void GetById_Action_Returns_Ok_Result()
        {   
            _mockMediatr.Setup(x => x.Send(It.IsAny<GetProperty>(), new CancellationToken())).
                ReturnsAsync(Property.Create(new CreateProperty()));

            //Action
            var result = _controller.GetById("a");

            //Assert
            Assert.IsType<Task<ActionResult<Property>>>(result);
        }
    }
}
