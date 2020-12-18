using MediatR;
using MLAPI.Models;

namespace MLAPI.DTOs
{
    public class GetProperty : IRequest<Property>
    {
        public string Id { get; set; }
    }
}
