using MediatR;

namespace MLAPI.DTOs
{
    public class DeleteProperty : IRequest
    {
        public string Id { get; set; }
    }
}
