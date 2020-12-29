using MediatR;
using MLAPI.DTOs;
using MLAPI.Models;
using MLAPI.Services;
using System.Threading;
using System.Threading.Tasks;

namespace MLAPI.Business
{
    public class UpdatePropertyHandler : IRequestHandler<UpdateProperty, Property>
    {
        private readonly IPropertyService propertyService;

        public UpdatePropertyHandler(IPropertyService propertyService)
        {
            this.propertyService = propertyService;
        }

        public async Task<Property> Handle(UpdateProperty request, CancellationToken cancellationToken)
        {
            var prop = await propertyService.GetById(request.Id);
            if(prop != null)
            {
                prop.Update(request);
                propertyService.Update(request.Id, prop);
            }
            return prop;
        }
    }
}
