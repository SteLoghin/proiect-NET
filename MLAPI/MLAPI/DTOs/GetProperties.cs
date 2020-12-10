using MediatR;
using MLAPI.Data;
using System.Collections.Generic;

namespace MLAPI.DTOs
{
    public class GetProperties : IRequest<List<Property>>
    {

    }
}
