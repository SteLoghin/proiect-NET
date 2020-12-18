using MediatR;
using MLAPI.Models;
using System.Collections.Generic;

namespace MLAPI.DTOs
{
    public class GetProperties : IRequest<List<Property>>
    {

    }
}
