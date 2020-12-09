using System;
using System.Collections.Generic;

namespace MLAPI.Data
{
    public interface IRepository<T> where T: BaseEntity
    {
        IEnumerable<T> GetAll();

        IEnumerable<T> GetByCriteria(Func<T, bool> filter);

        bool Create(T entity);

        void Update(T entity);

        T Remove(int id);
    }
}
