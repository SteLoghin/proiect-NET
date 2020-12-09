using System;
using System.Collections.Generic;

namespace MLAPI.Data
{
    public class Repository<T> : IRepository<T> where T : BaseEntity
    {
        private readonly DataContext context;
        public Repository(DataContext context)
        {
            this.context = context;
        }

        public bool Create(T entity)
        {
            return true;
        }

        public IEnumerable<T> GetAll()
        {
            return null;
        }

        public T GetById(int id)
        {
            return null;
        }

        public T Remove(int id)
        {
            return null;
        }

        public void Update(T entity)
        {
        }

        //might probably be used in admin to filter train entries, or might be used to bring data for the client(the link list)
        public IEnumerable<T> GetByCriteria(Func<T, bool> filter)
        {
            return null;
        }
    }
}
