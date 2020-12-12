using MediatR;
using MLAPI.Data;
using MLAPI.DTOs;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MLAPI.Business
{
    public class GetPropertiesHandler : IRequestHandler<GetProperties, List<Property>>
    {
        //private readonly DataContext context;

        public GetPropertiesHandler()//DataContext context)
        {
            //this.context = context;
        }
        public async Task<List<Property>> Handle(GetProperties request, CancellationToken cancellationToken)
        {
            //get properties from the db
            return null;
        }
    }
}
