using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Domain.Entities
{
    public class Blog
    {
        public int Id { get; set; }
        private string _name;
        public string Name {
            get => _name;
            set => _name = value?.Trim() ?? string.Empty;
        }
        private string _description;
        public string Description { 
            get => _description;
            set => _description = value?.Trim() ?? string.Empty;
        }

        private string _author;
        public string Author { 
            get => _author;
            set => _author = value?.Trim() ?? string.Empty;
        }

        private string _genre;
        public string Genre
        {
            get => _genre;
            set => _genre =value?.Trim() ?? string.Empty;
        }

    }
}
